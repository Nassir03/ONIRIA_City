from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.api.admin_dependencies import current_staff, require_database
from app.repositories.staff_repository import StaffRepository
from app.schemas.admin_auth_schemas import AdminLoginRequest
from app.security.password_hashing import verify_password
from app.security.session_manager import SESSION_COOKIE_NAME, create_session_token, hash_session_token, session_expires_at

router = APIRouter(prefix="/admin", tags=["admin auth"])


@router.post("/login")
async def login(payload: AdminLoginRequest, request: Request, response: Response, database=Depends(require_database)):
    repo = StaffRepository(database)
    email = str(payload.email).lower()
    if await repo.count_recent_failed_logins(email) >= 8:
        await repo.record_login_attempt(email, request.client.host if request.client else None, False, "rate_limited")
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many failed login attempts")

    staff = await repo.get_staff_by_email(email)
    if not staff or not staff.get("is_active") or not verify_password(payload.password, staff.get("password_hash", "")):
        await repo.record_login_attempt(email, request.client.host if request.client else None, False, "invalid_credentials")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid staff credentials")

    token = create_session_token()
    expires_at = session_expires_at()
    await repo.create_session(staff["id"], hash_session_token(token), expires_at)
    await repo.record_login_attempt(email, request.client.host if request.client else None, True)
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=request.url.scheme == "https",
        samesite="lax",
        max_age=8 * 60 * 60,
        path="/",
    )
    return {
        "success": True,
        "data": {
            "staff": {"id": staff["id"], "full_name": staff["full_name"], "email": staff["email"], "roles": staff["roles"]},
            "expires_at": expires_at,
        },
    }


@router.post("/logout")
async def logout(request: Request, response: Response, database=Depends(require_database)):
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if token:
        await StaffRepository(database).revoke_session(hash_session_token(token))
    response.delete_cookie(SESSION_COOKIE_NAME, path="/")
    return {"success": True, "data": {"logged_out": True}}


@router.get("/session")
async def session(staff=Depends(current_staff)):
    return {
        "success": True,
        "data": {
            "staff": {"id": staff["id"], "full_name": staff["full_name"], "email": staff["email"], "roles": staff["roles"]},
            "expires_at": staff["expires_at"],
        },
    }
