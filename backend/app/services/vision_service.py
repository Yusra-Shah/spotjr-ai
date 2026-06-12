import asyncio
import logging
from app.config import settings

logger = logging.getLogger(__name__)

_FALLBACK_FRAME = {
    "people_count": 1,
    "bounding_boxes": [[0.2, 0.1, 0.35, 0.6]],
    "dominant_colors": ["pink", "black"],
}


def _make_client():
    """Return an Azure AI Vision client if credentials are configured, else None."""
    if not settings.azure_ai_vision_endpoint or not settings.azure_ai_vision_key:
        return None
    try:
        from azure.ai.vision.imageanalysis import ImageAnalysisClient
        from azure.core.credentials import AzureKeyCredential

        return ImageAnalysisClient(
            endpoint=settings.azure_ai_vision_endpoint,
            credential=AzureKeyCredential(settings.azure_ai_vision_key),
        )
    except ImportError:
        logger.warning("azure-ai-vision-imageanalysis not installed; using fallback")
        return None


class VisionService:
    def __init__(self):
        self._client = _make_client()

    async def analyze_frame(self, image_path: str) -> dict:
        """Analyze a camera frame and return detected people and colors."""
        if not self._client:
            return _FALLBACK_FRAME

        try:
            from azure.ai.vision.imageanalysis.models import VisualFeatures

            def _sync_analyze():
                with open(image_path, "rb") as f:
                    image_data = f.read()
                return self._client.analyze(
                    image_data=image_data,
                    visual_features=[VisualFeatures.PEOPLE, VisualFeatures.COLOR],
                )

            result = await asyncio.to_thread(_sync_analyze)
            people = result.people.list if result.people else []
            colors = []
            if result.color and result.color.dominant_colors:
                colors = [c.name.lower() for c in result.color.dominant_colors]

            return {
                "people_count": len(people),
                "bounding_boxes": [
                    [
                        p.bounding_box.x,
                        p.bounding_box.y,
                        p.bounding_box.width,
                        p.bounding_box.height,
                    ]
                    for p in people
                ],
                "dominant_colors": colors,
            }
        except FileNotFoundError:
            logger.warning("Image not found: %s", image_path)
            return {"people_count": 0, "bounding_boxes": [], "dominant_colors": []}
        except Exception as exc:
            logger.error("analyze_frame failed: %s", exc)
            return {"people_count": 0, "bounding_boxes": [], "dominant_colors": []}

    def compare_descriptions(self, query_description: str, frame_analysis: dict) -> float:
        """Return a 0.0–1.0 confidence score matching the description to the frame."""
        if not frame_analysis.get("people_count"):
            return 0.0

        score = 0.3  # base score: at least one person detected
        desc_lower = query_description.lower()

        for color in frame_analysis.get("dominant_colors", []):
            if color in desc_lower:
                score += 0.25

        score = min(score, 1.0)
        return round(score, 2)
