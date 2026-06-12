"""
CoordinatorAgent — the multi-step reasoning chain for SpotJr.

Flow:
  1. Parse child description → extract visual attributes (FoundryService)
  2. Load pre-seeded synthetic detection events
  3. Build timeline + predict next location (TimelineService)
  4. Calculate risk score (TimelineService)
  5. Generate plain-English risk reasoning (FoundryService)
  6. Return complete CaseResponse
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime
from pathlib import Path

from app.models.schemas import CaseCreate, CaseResponse, DetectionEvent
from app.services.foundry_service import FoundryService
from app.services.timeline_service import TimelineService

logger = logging.getLogger(__name__)

_DETECTIONS_PATH = Path(__file__).resolve().parents[3] / "data" / "synthetic" / "detections.json"


def _load_detections(case_id: str) -> list[dict]:
    """Load pre-seeded synthetic detections for a given case_id."""
    try:
        data: list[dict] = json.loads(_DETECTIONS_PATH.read_text(encoding="utf-8"))
        return [d for d in data if d.get("case_id") == case_id or case_id == "demo-001"]
    except Exception as exc:
        logger.warning("Could not load detections: %s", exc)
        return []


class CoordinatorAgent:
    def __init__(self):
        self._foundry = FoundryService()
        self._timeline_svc = TimelineService()

    async def process_new_case(self, case_data: CaseCreate) -> CaseResponse:
        case_id = f"CASE-{uuid.uuid4().hex[:6].upper()}"

        # Step 1: Extract visual attributes from the child description
        attributes = await self._foundry.analyze_child_description(
            case_data.child_description
        )
        logger.info("Case %s — extracted attributes: %s", case_id, attributes)

        # Step 2: Load pre-seeded synthetic detections (demo data)
        raw_detections = _load_detections("demo-001")
        for d in raw_detections:
            d["case_id"] = case_id  # re-stamp with real case ID

        # Step 3: Build timeline
        timeline_dicts = self._timeline_svc.build_timeline(raw_detections)
        timeline_events = [
            DetectionEvent(
                case_id=d["case_id"],
                camera_id=d["camera_id"],
                timestamp=d["timestamp"],
                confidence=d["confidence"],
                zone=d["zone"],
                bbox=d.get("bbox", []),
            )
            for d in timeline_dicts
        ]

        # Step 4: Predict next location
        current_zone = timeline_dicts[-1]["zone"] if timeline_dicts else case_data.last_seen_zone
        prediction = self._timeline_svc.predict_next_location(timeline_dicts)

        # Step 5: Calculate risk score
        reported_str = case_data.last_seen_time
        try:
            reported_dt = datetime.fromisoformat(reported_str.replace("Z", "+00:00"))
            minutes_missing = max(1, int((datetime.utcnow() - reported_dt.replace(tzinfo=None)).total_seconds() / 60))
        except ValueError:
            minutes_missing = 10

        risk_score = self._timeline_svc.calculate_risk_score(
            timeline_dicts, current_zone, minutes_missing
        )

        # Step 6: Generate plain-English risk reasoning
        if risk_score.factors:
            risk_score.reason = await self._foundry.get_risk_reasoning(risk_score.factors)

        return CaseResponse(
            case_id=case_id,
            status="active",
            risk_score=risk_score,
            timeline=timeline_events,
            prediction=prediction,
            guard_dispatched=False,
        )
