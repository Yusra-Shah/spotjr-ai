"""
One-time camera analysis script for SpotJr hackathon demo.
Run from the backend directory:
    cd backend && python scripts/analyze_cameras.py

Extracts the middle frame from each cam-XX.mp4 in frontend/public/videos/,
runs Azure AI Vision (people detection), crops each detected person,
then calls GPT-4o Vision for a clothing description.
Results are cached in data/synthetic/vision_results.json.
"""

from __future__ import annotations

import base64
import json
import sys
from pathlib import Path

# Make `app.config` importable when run from `backend/`
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import cv2
from PIL import Image

from app.config import settings

# ── Paths ──────────────────────────────────────────────────────────────────────
_BACKEND   = Path(__file__).resolve().parent.parent
_SPOTJR    = _BACKEND.parent
VIDEOS_DIR = _SPOTJR / "frontend" / "public" / "videos"
FRAMES_DIR = _BACKEND / "data" / "synthetic" / "frames"
CROPS_DIR  = _BACKEND / "data" / "synthetic" / "crops"
OUTPUT_JSON = _BACKEND / "data" / "synthetic" / "vision_results.json"

MAX_PERSONS_PER_FRAME = 2  # 12 cams × 2 crops = 24 GPT calls + 12 Vision = 36 total

_CLOTHING_TAGS = {
    'shirt', 't-shirt', 'jacket', 'coat', 'dress', 'pants', 'jeans', 'shorts',
    'skirt', 'hoodie', 'sweater', 'suit', 'blouse', 'hat', 'cap', 'bag',
    'backpack', 'handbag', 'luggage', 'glasses', 'sunglasses', 'shoes', 'sneakers',
}
_AGE_TAGS = {'man', 'woman', 'boy', 'girl', 'child', 'adult', 'elderly', 'person'}


def _build_description(caption: str | None, tags: list[str]) -> str:
    """Combine Vision caption + clothing/age tags into a natural description."""
    base = caption or "a person"
    clothing = [t for t in tags if t.lower() in _CLOTHING_TAGS]
    age = [t for t in tags if t.lower() in _AGE_TAGS]
    extra = list(dict.fromkeys(age + clothing))  # deduplicate, age first
    if extra:
        # Avoid repeating things already in base
        novel = [t for t in extra if t.lower() not in base.lower()]
        if novel:
            base = f"{base}; {', '.join(novel[:4])}"
    return base


def _cam_id_from_path(video_path: Path) -> str:
    """Return 'cam-01' from 'cam-01.mp4.mp4' or 'cam-02.mp4'."""
    stem = video_path.stem          # cam-01.mp4  OR  cam-02
    return stem[:-4] if stem.endswith(".mp4") else stem


def extract_mid_frame(video_path: Path, output_path: Path) -> bool:
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        print(f"  [ERROR] Cannot open: {video_path.name}")
        return False
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, total // 2))
    ret, frame = cap.read()
    cap.release()
    if not ret:
        print(f"  [ERROR] Cannot read mid-frame from {video_path.name}")
        return False
    cv2.imwrite(str(output_path), frame)
    print(f"  Frame extracted: frame {total//2}/{total} -> {output_path.name}")
    return True


def crop_person(frame_path: Path, bbox: dict, output_path: Path) -> bool:
    img = Image.open(frame_path)
    W, H = img.size
    x  = max(0, int(bbox["x"]))
    y  = max(0, int(bbox["y"]))
    bw = min(int(bbox["width"]),  W - x)
    bh = min(int(bbox["height"]), H - y)
    if bw <= 4 or bh <= 4:
        return False
    img.crop((x, y, x + bw, y + bh)).save(str(output_path))
    return True


def to_base64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("utf-8")


def main() -> None:
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    CROPS_DIR.mkdir(parents=True, exist_ok=True)

    # ── Validate credentials ──────────────────────────────────────────────────
    missing = [
        k for k, v in {
            "AZURE_AI_VISION_ENDPOINT": settings.azure_ai_vision_endpoint,
            "AZURE_AI_VISION_KEY":      settings.azure_ai_vision_key,
        }.items() if not v
    ]
    if missing:
        print(f"[FATAL] Missing credentials in .env: {missing}")
        sys.exit(1)

    # ── Azure clients ─────────────────────────────────────────────────────────
    from azure.ai.vision.imageanalysis import ImageAnalysisClient
    from azure.ai.vision.imageanalysis.models import VisualFeatures
    from azure.core.credentials import AzureKeyCredential

    vision_client = ImageAnalysisClient(
        endpoint=settings.azure_ai_vision_endpoint,
        credential=AzureKeyCredential(settings.azure_ai_vision_key),
    )

    # ── Find videos ───────────────────────────────────────────────────────────
    video_files = sorted(VIDEOS_DIR.glob("cam-*.mp4"))
    if not video_files:
        print(f"[FATAL] No cam-*.mp4 files found in {VIDEOS_DIR}")
        sys.exit(1)
    print(f"Found {len(video_files)} video(s): {[v.name for v in video_files]}\n")

    results: dict = {}
    vision_calls = 0

    for video_file in video_files:
        cam_id = _cam_id_from_path(video_file)
        print(f"=== {cam_id} ({video_file.name}) ===")

        # Extract mid-frame
        frame_filename = f"{cam_id}.jpg"
        frame_path = FRAMES_DIR / frame_filename
        if not extract_mid_frame(video_file, frame_path):
            continue

        # Azure AI Vision — detect people on full frame
        print(f"  Calling Azure AI Vision (people detection)...")
        try:
            vision_result = vision_client.analyze(
                image_data=frame_path.read_bytes(),
                visual_features=[VisualFeatures.PEOPLE],
            )
            vision_calls += 1
        except Exception as exc:
            print(f"  [ERROR] Vision API: {exc}")
            results[cam_id] = {"frame": f"frames/{frame_filename}", "detections": []}
            continue

        people = vision_result.people.list if vision_result.people else []
        print(f"  Detected {len(people)} person(s)")

        # Sort by confidence, cap at MAX_PERSONS_PER_FRAME
        people_sorted = sorted(people, key=lambda p: p.confidence, reverse=True)
        detections = []

        for idx, person in enumerate(people_sorted[:MAX_PERSONS_PER_FRAME]):
            person_id = f"{cam_id}_person-{idx}"
            bb = person.bounding_box
            bbox = {
                "x": int(bb.x), "y": int(bb.y),
                "width": int(bb.width), "height": int(bb.height),
            }

            # Crop person from frame
            crop_filename = f"{person_id}.jpg"
            crop_path = CROPS_DIR / crop_filename
            cropped_ok = crop_person(frame_path, bbox, crop_path)
            if not cropped_ok:
                print(f"  [WARN] Bad bbox for {person_id}: {bbox} — using full frame")
                crop_path = frame_path

            # Azure AI Vision CAPTION + TAGS on the crop — describes clothing/appearance
            print(f"  Vision caption -> {person_id}...")
            try:
                caption_result = vision_client.analyze(
                    image_data=crop_path.read_bytes(),
                    visual_features=[VisualFeatures.CAPTION, VisualFeatures.TAGS],
                )
                vision_calls += 1
                caption_text = caption_result.caption.text if caption_result.caption else None
                tag_names = (
                    [t.name for t in caption_result.tags.list if t.confidence > 0.6]
                    if caption_result.tags else []
                )
                ai_description = _build_description(caption_text, tag_names)
            except Exception as exc:
                print(f"  [WARN] Caption failed for {person_id}: {exc}")
                ai_description = f"Person detected at {cam_id}"

            print(f"    conf={person.confidence:.2f}  \"{ai_description}\"")
            detections.append({
                "person_id": person_id,
                "bbox": bbox,
                "crop": f"crops/{crop_filename}",
                "ai_description": ai_description,
                "vision_confidence": round(person.confidence, 4),
            })

        results[cam_id] = {
            "frame": f"frames/{frame_filename}",
            "detections": detections,
        }
        print()

    # ── Save ──────────────────────────────────────────────────────────────────
    OUTPUT_JSON.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("=" * 60)
    print(f"Saved: {OUTPUT_JSON}")
    print(f"Azure Vision API calls: {vision_calls}  {'[OK under 40]' if vision_calls <= 40 else '[WARNING: over 40]'}")
    print(f"  (1 per frame for people detection + 1 per crop for caption = up to {len(list(VIDEOS_DIR.glob('cam-*.mp4'))) * (1 + MAX_PERSONS_PER_FRAME)} total)")


if __name__ == "__main__":
    main()
