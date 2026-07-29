from __future__ import annotations

import logging
from dataclasses import dataclass

from app.config import Settings

logger = logging.getLogger(__name__)


@dataclass
class EmailSendResult:
    delivered: bool
    provider: str


class EmailService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def send_staff_password_reset(self, *, recipient: str, reset_url: str, expires_minutes: int) -> EmailSendResult:
        provider = (self.settings.mail_provider or "").strip().lower()
        if not provider:
            logger.info("staff password reset email skipped; MAIL_PROVIDER is not configured")
            return EmailSendResult(delivered=False, provider="development_fallback")

        logger.info("staff password reset email provider is configured but no provider adapter is installed")
        return EmailSendResult(delivered=False, provider=provider)
