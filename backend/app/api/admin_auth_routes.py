import logging

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.api.admin_dependencies import current_staff, require_database
from app.config import get_settings
from app.repositories.staff_repository import StaffRepository
from app.schemas.account_recovery_schemas import RecoveryRequestCreate
from app.schemas.admin_auth_schemas import AdminLoginRequest, ForgotPasswordRequest, ResetPasswordRequest, ValidateResetTokenRequest
from app.security.password_hashing import verify_password
from app.security.session_manager import SESSION_COOKIE_NAME, create_session_token, hash_session_token, session_expires_at
from app.services.account_recovery_service import AccountRecoveryService
from app.services.password_reset_service import PasswordResetService
from app.utils.rate_limit import FixedWindowRateLimiter

router = APIRouter(prefix="/admin", tags=["admin auth"])
logger = logging.getLogger(__name__)
forgot_password_limiter = FixedWindowRateLimiter(max_attempts=5, window_seconds=15 * 60)
reset_token_limiter = FixedWindowRateLimiter(max_attempts=12, window_seconds=15 * 60)
recovery_request_limiter = FixedWindowRateLimiter(max_attempts=3, window_seconds=60 * 60)


def session_cookie_options() -> dict[str, object]:
    settings = get_settings()
    options: dict[str, object] = {
        "httponly": True,
        "secure": settings.session_cookie_secure,
        "samesite": settings.session_cookie_samesite,
        "max_age": 8 * 60 * 60,
        "path": "/",
    }
    if settings.session_cookie_domain:
        options["domain"] = settings.session_cookie_domain
    return options


def session_cookie_delete_options() -> dict[str, object]:
    settings = get_settings()
    options: dict[str, object] = {
        "path": "/",
        "secure": settings.session_cookie_secure,
        "samesite": settings.session_cookie_samesite,
    }
    if settings.session_cookie_domain:
        options["domain"] = settings.session_cookie_domain
    return options


def local_admin_auth_log(message: str, **details) -> None:
    if get_settings().app_env == "local":
        logger.info(message, extra=details)


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
        **session_cookie_options(),
    )
    local_admin_auth_log("admin login completed", status_code=200, set_cookie=True)
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
    response.delete_cookie(SESSION_COOKIE_NAME, **session_cookie_delete_options())
    local_admin_auth_log("admin logout completed", status_code=200, cookie_deleted=True)
    return {"success": True, "data": {"logged_out": True}}


@router.get("/session")
async def session(staff=Depends(current_staff)):
    local_admin_auth_log("admin session completed", status_code=200)
    return {
        "success": True,
        "data": {
            "staff": {"id": staff["id"], "full_name": staff["full_name"], "email": staff["email"], "roles": staff["roles"]},
            "expires_at": staff["expires_at"],
        },
    }


@router.post("/auth/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, request: Request, database=Depends(require_database)):
    ip = request.client.host if request.client else "unknown"
    if not forgot_password_limiter.allow(f"{ip}:{str(payload.email).lower()}"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests. Please try again later.")
    service = PasswordResetService(database, get_settings())
    result = await service.request_reset(
        email=str(payload.email),
        requested_ip=None if ip == "unknown" else ip,
        requested_user_agent=request.headers.get("user-agent"),
    )
    return {"success": True, "data": result}


@router.post("/auth/validate-reset-token")
async def validate_reset_token(payload: ValidateResetTokenRequest, database=Depends(require_database)):
    if not reset_token_limiter.allow(f"validate:{payload.token[:24]}"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests. Please try again later.")
    valid = await PasswordResetService(database, get_settings()).validate_token(payload.token)
    return {"success": True, "data": {"valid": valid}}


@router.post("/auth/reset-password")
async def reset_password(payload: ResetPasswordRequest, request: Request, database=Depends(require_database)):
    ip = request.client.host if request.client else "unknown"
    if not reset_token_limiter.allow(f"{ip}:{payload.token[:24]}"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests. Please try again later.")
    service = PasswordResetService(database, get_settings())
    try:
        await service.reset_password(
            token=payload.token,
            new_password=payload.new_password,
            confirm_password=payload.confirm_password,
            ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    return {"success": True, "data": {"message": "Your password has been changed. Sign in with your new password."}}


@router.post("/auth/recovery-request")
async def recovery_request(payload: RecoveryRequestCreate, request: Request, database=Depends(require_database)):
    ip = request.client.host if request.client else "unknown"
    key = f"{ip}:{payload.phone}:{str(payload.known_email).lower() if payload.known_email else 'no-email'}"
    if not recovery_request_limiter.allow(key):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests. Please try again later.")
    result = await AccountRecoveryService(database).create_request(payload)
    return {"success": True, "data": result}
