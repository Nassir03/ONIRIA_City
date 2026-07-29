import hashlib
import secrets
from datetime import datetime, timedelta, timezone


SESSION_COOKIE_NAME = "oniria_staff_session"
SESSION_HOURS = 8


def create_session_token() -> str:
    return secrets.token_urlsafe(48)


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def session_expires_at() -> datetime:
    return datetime.now(timezone.utc) + timedelta(hours=SESSION_HOURS)
