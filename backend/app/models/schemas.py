from pydantic import BaseModel
from typing import Optional


class CaseCreate(BaseModel):
    child_description: str
    age_estimate: int
    clothing_upper: str
    clothing_lower: str
    last_seen_zone: str
    last_seen_time: str
    parent_contact: str


class DetectionEvent(BaseModel):
    case_id: str
    camera_id: str
    timestamp: str
    confidence: float
    zone: str
    bbox: list[float]


class RiskScore(BaseModel):
    score: int
    level: str
    reason: str
    factors: list[str]


class CaseResponse(BaseModel):
    case_id: str
    status: str
    risk_score: RiskScore
    timeline: list[DetectionEvent]
    prediction: dict
    guard_dispatched: bool


class DispatchRequest(BaseModel):
    guard_id: str
    target_zone: str
    message: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
