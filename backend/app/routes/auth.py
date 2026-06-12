"""
Auth routes — simple demo login with two hardcoded accounts.
Credentials are NOT secrets (demo only, not in .env).
"""

from __future__ import annotations

from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException
from jose import jwt

from app.config import settings
from app.models.schemas import LoginRequest, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Demo accounts — username → (password, role). Not sensitive; demo-only.
_DEMO_ACCOUNTS: dict[str, tuple[str, str]] = {
    "operator": ("spotjr2026", "operator"),
    "guard":    ("spotjr2026", "guard"),
}

_ALGORITHM = "HS256"
_TOKEN_EXPIRE_HOURS = 8


def _create_token(username: str, role: str) -> str:
    secret = settings.jwt_secret or "spotjr-insecure-demo-key"
    payload = {
        "sub": username,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=_TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, secret, algorithm=_ALGORITHM)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest) -> TokenResponse:
    account = _DEMO_ACCOUNTS.get(body.username)
    if not account or account[0] != body.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = _create_token(body.username, account[1])
    return TokenResponse(access_token=token, role=account[1])
