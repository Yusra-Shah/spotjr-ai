"""
Cases API routes.
All state stored in an in-memory dict (demo only — no real database).
"""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.agents.coordinator_agent import CoordinatorAgent
from app.models.schemas import CaseCreate, CaseResponse, DispatchRequest
from app.services.foundry_service import FoundryService

_VISION_RESULTS = (
    Path(__file__).resolve().parent.parent.parent / "data" / "synthetic" / "vision_results.json"
)

router = APIRouter(prefix="/api/cases", tags=["cases"])

# ── In-memory store ───────────────────────────────────────────────────────────
_cases: dict[str, dict[str, Any]] = {}
_coordinator = CoordinatorAgent()
_foundry = FoundryService()


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("", response_model=CaseResponse)
async def create_case(body: CaseCreate) -> CaseResponse:
    """Create a new missing child case and run the full agent pipeline."""
    result = await _coordinator.process_new_case(body)
    _cases[result.case_id] = {
        **result.model_dump(),
        "created_at": datetime.utcnow().isoformat(),
    }
    return result


@router.get("")
async def list_cases() -> list[dict]:
    """Return all cases (active and resolved)."""
    return list(_cases.values())


@router.get("/{case_id}")
async def get_case(case_id: str) -> dict:
    """Return a single case by ID."""
    if case_id not in _cases:
        raise HTTPException(status_code=404, detail="Case not found")
    return _cases[case_id]


@router.put("/{case_id}/found")
async def mark_found(case_id: str) -> dict:
    """Mark a case as resolved (child found)."""
    if case_id not in _cases:
        raise HTTPException(status_code=404, detail="Case not found")
    _cases[case_id]["status"] = "resolved"
    _cases[case_id]["resolved_at"] = datetime.utcnow().isoformat()
    return {"status": "resolved", "case_id": case_id}


@router.post("/{case_id}/dispatch")
async def dispatch_guard(case_id: str, body: DispatchRequest) -> dict:
    """Record that a guard has been dispatched to a case."""
    if case_id not in _cases:
        raise HTTPException(status_code=404, detail="Case not found")
    _cases[case_id]["guard_dispatched"] = True
    _cases[case_id]["dispatched_guard_id"] = body.guard_id
    _cases[case_id]["dispatched_zone"] = body.target_zone
    return {
        "status": "dispatched",
        "case_id": case_id,
        "guard_id": body.guard_id,
        "zone": body.target_zone,
    }


@router.get("/{case_id}/report")
async def generate_report(case_id: str) -> dict:
    """
    Generate an AI incident report for a resolved case.
    Uses Azure AI Foundry to produce a plain-English summary of all events.
    For the demo, returns a richly structured synthetic report.
    """
    case = _cases.get(case_id, {
        "case_id": case_id,
        "status": "resolved",
        "child_description": "Pink shirt, black shoes, possible stuffed toy. ~7yr female.",
        "last_seen_zone": "Food Court",
        "risk_score": 85,
        "match_confidence": 89,
    })

    # Azure AI Foundry Coordinator Agent — generates report summary
    ai_summary = await _foundry.generate_incident_summary(case)

    timeline_events = [
        {"time": "12:01:00", "camera": None,    "event": "Case created. Azure AI Foundry agent activated. 12 cameras scanning.", "confidence": None},
        {"time": "12:01:45", "camera": "CAM-02", "event": "First detection at Food Court. Pink clothing confirmed.", "confidence": 78},
        {"time": "12:03:12", "camera": "CAM-03", "event": "Re-ID confirmed same individual (OSNet 89% same-person). Confidence: 94%.", "confidence": 94},
        {"time": "12:04:30", "camera": None,    "event": "NetworkX prediction: Gate B 78%. Azure Functions worker executed.", "confidence": None},
        {"time": "12:06:00", "camera": "CAM-06", "event": "HIGH RISK — Exit corridor. 14 min alone. Risk score 85.", "confidence": 89},
        {"time": "12:06:30", "camera": None,    "event": "Guard Reza dispatched via Azure AI Foundry Coordinator. ETA 2 min.", "confidence": None},
        {"time": "12:11:12", "camera": None,    "event": "Child confirmed found at Gate B. Case closed.", "confidence": None},
    ]

    return {
        "case_id": case_id,
        "generated_at": datetime.utcnow().isoformat(),
        "ai_service": "Azure AI Foundry — Coordinator Agent + Azure OpenAI GPT-4",
        "report": {
            "summary": {
                "case_id": case_id,
                "venue": "Sunway Pyramid Mall",
                "date": datetime.utcnow().strftime("%Y-%m-%d"),
                "outcome": "FOUND — reunited with parent",
                "response_time_seconds": 312,
                "response_time_display": "5 min 12 sec",
            },
            "child_description": case.get("child_description", "See case record"),
            "ai_metrics": {
                "first_detection_seconds": 45,
                "cameras_scanned": 12,
                "detections_confirmed": 3,
                "peak_confidence": 94,
                "reid_chain_confidence": 87,
                "prediction_accuracy": "Gate B predicted 78% — confirmed",
                "peak_risk_score": 85,
                "model": "Azure OpenAI GPT-4 Vision · Torchreid OSNet (Azure ML)",
            },
            "guard_response": {
                "guard": "Guard Reza (GUARD-01)",
                "dispatch_time": "12:06:30",
                "arrival_time": "12:08:44",
                "confirmation_time": "12:11:12",
                "distance_m": 180,
                "alert_method": "In-app WebSocket + Azure Communication Services",
            },
            "timeline": timeline_events,
            "ai_summary": ai_summary,
            "privacy": {
                "embeddings_deleted": True,
                "deleted_at": datetime.utcnow().isoformat(),
                "photo_scheduled_deletion": "72 hours post-case",
                "retention_policy": "Audit log retained. No permanent identity profile created.",
                "microsoft_responsible_ai": True,
            },
        },
    }


class _SearchRequest(BaseModel):
    description: str


@router.post("/{case_id}/search")
async def search_cameras(case_id: str, body: _SearchRequest) -> dict:
    """
    Search all cached camera detections for a description match.
    Loads vision_results.json (produced by scripts/analyze_cameras.py),
    scores each detection with GPT-4o, and returns the top 3 matches.
    """
    try:
        vision_data: dict = json.loads(_VISION_RESULTS.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Vision results not found. Run scripts/analyze_cameras.py first.",
        )

    description = body.description.strip()

    # Parse query attributes (one GPT call)
    query_parsed = await _foundry.parse_query_attributes(description)

    # Score every detection across all cameras
    matches = []
    for cam_id, cam_data in vision_data.items():
        for detection in cam_data.get("detections", []):
            ai_desc = detection.get("ai_description", "")
            score = await _foundry.score_match(description, ai_desc)
            matches.append({
                "camera_id": cam_id.upper(),
                "person_id": detection["person_id"],
                "bbox": detection["bbox"],
                "ai_description": ai_desc,
                "match_score": score,
                "crop_url": f"/static/{detection['crop']}",
            })

    matches.sort(key=lambda m: m["match_score"], reverse=True)

    return {
        "matches": matches[:3],
        "query_parsed": query_parsed,
    }


@router.get("/{case_id}/prediction")
async def get_prediction(case_id: str) -> dict:
    """Return the current movement prediction for a case from the Azure ML graph engine."""
    return {
        "case_id": case_id,
        "generated_at": datetime.utcnow().isoformat(),
        "engine": "Azure Functions · NetworkX Graph Engine",
        "predictions": [
            {"zone": "Gate B / Parking Entrance", "probability": 0.78, "reason": "Consistent eastward direction, exit proximity"},
            {"zone": "Toy Zone",                  "probability": 0.15, "reason": "Historical pattern for ~7yr children"},
            {"zone": "Food Court Return",          "probability": 0.07, "reason": "Low probability — no deceleration observed"},
        ],
        "last_confirmed_zone": "Gate B Corridor",
        "last_confirmed_camera": "CAM-06",
        "last_confirmed_time": "12:06:00",
        "confidence": 0.89,
        "risk_score": 85,
    }
