from typing import Any

from fastapi import Depends, HTTPException, Request, status

from app.database import db
from app.repositories.staff_repository import StaffRepository
from app.security.permissions import has_permission
from app.security.session_manager import SESSION_COOKIE_NAME, hash_session_token


def require_database() -> Any:
    if not db.is_configured:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database is required for admin APIs")
    return db


async def current_staff(request: Request, database=Depends(require_database)) -> dict[str, Any]:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    session = await StaffRepository(database).get_session(hash_session_token(token))
    if not session or not session.get("is_active"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")
    return session


def require_permission(permission: str):
    async def dependency(staff: dict[str, Any] = Depends(current_staff)) -> dict[str, Any]:
        if not has_permission(staff.get("roles", []), permission):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised")
        return staff

    return dependency
