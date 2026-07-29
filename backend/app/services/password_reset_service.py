from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.config import Settings
from app.repositories.account_recovery_repository import AccountRecoveryRepository
from app.repositories.password_reset_repository import PasswordResetRepository
from app.repositories.staff_repository import StaffRepository
from app.security.password_hashing import hash_password, validate_password_strength, verify_password
from app.security.token_generator import create_secure_token, hash_token
from app.services.email_service import EmailService


NEUTRAL_FORGOT_PASSWORD_MESSAGE = "If an active staff account matches that email, password-reset instructions have been sent."
RESET_TOKEN_MINUTES = 20


class PasswordResetService:
    def __init__(self, pool, settings: Settings, email_service: EmailService | None = None) -> None:
        self.pool = pool
        self.settings = settings
        self.email_service = email_service or EmailService(settings)
        self.staff_repo = StaffRepository(pool)
        self.reset_repo = PasswordResetRepository(pool)

    async def request_reset(self, *, email: str, requested_ip: str | None, requested_user_agent: str | None) -> dict[str, str]:
        staff = await self.staff_repo.get_staff_by_email(email.lower())
        if staff and staff.get("is_active"):
            token = create_secure_token()
            expires_at = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_MINUTES)
            await self.reset_repo.revoke_unused_for_staff(staff["id"])
            await self.reset_repo.create_token(
                staff_user_id=staff["id"],
                token_hash=hash_token(token),
                expires_at=expires_at,
                requested_ip=requested_ip,
                requested_user_agent=requested_user_agent,
            )
            reset_url = f"{self.settings.frontend_url.rstrip('/')}/admin/reset-password?token={token}"
            await self.email_service.send_staff_password_reset(
                recipient=staff["email"],
                reset_url=reset_url,
                expires_minutes=RESET_TOKEN_MINUTES,
            )
        return {"message": NEUTRAL_FORGOT_PASSWORD_MESSAGE}

    async def validate_token(self, token: str) -> bool:
        if not token or len(token) > 256:
            return False
        return await self.reset_repo.get_valid_token(hash_token(token)) is not None

    async def reset_password(self, *, token: str, new_password: str, confirm_password: str, ip: str | None, user_agent: str | None) -> None:
        if new_password != confirm_password:
            raise ValueError("New password and confirmation must match.")
        validate_password_strength(new_password)
        token_row = await self.reset_repo.get_valid_token(hash_token(token))
        if not token_row:
            raise ValueError("Reset link is invalid or has expired.")
        if verify_password(new_password, token_row.get("password_hash", "")):
            raise ValueError("New password must be different from the previous password.")

        staff_id = int(token_row["staff_user_id"])
        await self.staff_repo.update_password(staff_id, hash_password(new_password))
        revoked_sessions = await self.staff_repo.revoke_staff_sessions(staff_id)
        await self.reset_repo.mark_used(int(token_row["id"]))
        recovery_repo = AccountRecoveryRepository(self.pool)
        await recovery_repo.audit(
            staff_id,
            "PASSWORD_RESET_COMPLETED",
            int(token_row["id"]),
            None,
            {"staff_user_id": staff_id},
            ip,
            user_agent,
        )
        if revoked_sessions:
            await recovery_repo.audit(
                staff_id,
                "SESSION_REVOKED_AFTER_PASSWORD_RESET",
                int(token_row["id"]),
                None,
                {"staff_user_id": staff_id, "sessions_revoked": revoked_sessions},
                ip,
                user_agent,
            )
