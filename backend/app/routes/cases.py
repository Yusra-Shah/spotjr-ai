"""
Cases API routes.
All state stored in an in-memory dict (demo only — no real database).
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException

from app.agents.coordinator_agent import CoordinatorAgent
from app.models.schemas import CaseCreate, CaseResponse, DispatchRequest

router = APIRouter(prefix="/api/cases", tags=["cases"])

# ── In-memory store ───────────────────────────────────────────────────────────
_cases: dict[str, dict[str, Any]] = {}
_coordinator = CoordinatorAgent()


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
