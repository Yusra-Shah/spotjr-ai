"""
SpotJr FastAPI backend entry point.

Start with:
    cd backend && python -m uvicorn main:app --reload
"""

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routes.auth import router as auth_router
from app.routes.cases import router as cases_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="SpotJr API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(cases_router)

# ── Static files (crop images + frames for demo) ──────────────────────────────
_SYNTHETIC_DIR = Path(__file__).resolve().parent / "data" / "synthetic"
_SYNTHETIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(_SYNTHETIC_DIR)), name="static")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "SpotJr API", "version": "0.1.0"}


# ── WebSocket: live detection feed ────────────────────────────────────────────
_DETECTIONS_PATH = (
    Path(__file__).resolve().parent.parent / "data" / "synthetic" / "detections.json"
)


@app.websocket("/ws/{case_id}")
async def websocket_detection_feed(websocket: WebSocket, case_id: str) -> None:
    """
    Broadcast pre-seeded detection events to connected clients every 5 seconds.
    Used by the frontend to simulate live AI detections.
    """
    await websocket.accept()

    events: list[dict] = []
    try:
        events = json.loads(_DETECTIONS_PATH.read_text(encoding="utf-8"))
    except Exception:
        pass

    idx = 0
    try:
        while True:
            if events:
                event = dict(events[idx % len(events)])
                event["case_id"] = case_id
                await websocket.send_json({"type": "detection", "data": event})
                idx += 1
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass
