from __future__ import annotations

import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Mall zone connectivity graph (hardcoded)
MALL_GRAPH: dict[str, list[str]] = {
    "Main Entrance":   ["Food Court"],
    "Food Court":      ["Main Entrance", "Food Court East", "Toy Zone", "Restrooms"],
    "Food Court East": ["Food Court", "Corridor"],
    "Toy Zone":        ["Food Court"],
    "Restrooms":       ["Food Court"],
    "Corridor":        ["Food Court East", "Gate B"],
    "Gate B":          ["Corridor", "Parking Level 1"],
    "Parking Level 1": ["Gate B"],
}

# Risk factor weights
_RISK_WEIGHTS = {
    "near_exit":           30,
    "alone_over_10_min":   20,
    "parking_zone":        25,
    "high_crowd_area":     10,
    "no_detection_5_min":  15,
}


class TimelineService:
    def build_timeline(self, detection_events: list[dict]) -> list[dict]:
        """Sort detection events by timestamp and enrich with movement context."""
        sorted_events = sorted(detection_events, key=lambda e: e.get("timestamp", ""))

        for i, event in enumerate(sorted_events):
            if i > 0:
                event["previous_zone"] = sorted_events[i - 1].get("zone")
                event["time_gap_seconds"] = _time_gap(
                    sorted_events[i - 1].get("timestamp", ""),
                    event.get("timestamp", ""),
                )
            else:
                event["previous_zone"] = None
                event["time_gap_seconds"] = 0

        return sorted_events

    def predict_next_location(
        self, timeline: list[dict], mall_graph: dict | None = None
    ) -> dict:
        """Predict next likely zone based on movement trajectory using the mall graph."""
        graph = mall_graph or MALL_GRAPH

        if not timeline:
            return {"zone": "Unknown", "probability": 0.0, "reason": "No detections available"}

        last_zone = timeline[-1].get("zone", "")
        neighbors = graph.get(last_zone, [])

        if not neighbors:
            return {
                "zone": last_zone,
                "probability": 0.5,
                "reason": f"No connected zones from {last_zone}",
            }

        # Prefer exits (higher risk zones)
        exit_zones = {"Gate B", "Parking Level 1", "Main Entrance"}
        exit_neighbors = [z for z in neighbors if z in exit_zones]

        if exit_neighbors:
            predicted = exit_neighbors[0]
            probability = 0.78
            reason = f"Movement trajectory suggests heading toward exit zone {predicted}"
        else:
            predicted = neighbors[0]
            probability = 0.55
            reason = f"Child likely moving toward {predicted} based on trajectory"

        return {
            "zone": predicted,
            "probability": probability,
            "reason": reason,
            "alternatives": [
                {"zone": z, "probability": round(0.3 / len(neighbors), 2)}
                for z in neighbors
                if z != predicted
            ],
        }

    def calculate_risk_score(
        self,
        timeline: list[dict],
        current_zone: str,
        time_missing_minutes: int,
    ) -> object:
        """Calculate a 0–100 risk score with contributing factors."""
        from app.models.schemas import RiskScore

        score = 0
        factors: list[str] = []

        exit_zones = {"Gate B", "Parking Level 1", "Main Entrance"}
        if current_zone in exit_zones:
            score += _RISK_WEIGHTS["near_exit"]
            factors.append("near exit zone")

        if current_zone in {"Parking Level 1", "Gate B"}:
            score += _RISK_WEIGHTS["parking_zone"]
            factors.append("parking/exit area (high risk)")

        if time_missing_minutes >= 10:
            score += _RISK_WEIGHTS["alone_over_10_min"]
            factors.append(f"alone for {time_missing_minutes}+ minutes")

        if current_zone in {"Food Court", "Food Court East"}:
            score += _RISK_WEIGHTS["high_crowd_area"]
            factors.append("high crowd density area")

        if timeline:
            last_ts = timeline[-1].get("timestamp", "")
            if last_ts:
                gap = _time_gap(last_ts, datetime.utcnow().isoformat())
                if gap > 300:
                    score += _RISK_WEIGHTS["no_detection_5_min"]
                    factors.append("no detection in last 5+ minutes")

        score = min(score, 100)

        if score >= 85:
            level = "critical"
        elif score >= 70:
            level = "high"
        elif score >= 40:
            level = "medium"
        else:
            level = "low"

        reason = "; ".join(factors) if factors else "Standard monitoring"

        return RiskScore(score=score, level=level, reason=reason, factors=factors)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _time_gap(ts1: str, ts2: str) -> int:
    """Return elapsed seconds between two ISO timestamps. Returns 0 on parse error."""
    try:
        fmt = "%Y-%m-%dT%H:%M:%SZ"
        t1 = datetime.strptime(ts1[:19].replace("T", "T"), "%Y-%m-%dT%H:%M:%S")
        t2 = datetime.strptime(ts2[:19].replace("T", "T"), "%Y-%m-%dT%H:%M:%S")
        return max(0, int((t2 - t1).total_seconds()))
    except ValueError:
        return 0
