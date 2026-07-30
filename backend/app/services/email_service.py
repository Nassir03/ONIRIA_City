from __future__ import annotations

import logging
from dataclasses import dataclass
from html import escape
from typing import Any

import httpx
from pydantic import EmailStr, TypeAdapter

from app.config import Settings
from app.schemas.enquiry_schemas import EnquiryCreate

logger = logging.getLogger(__name__)
email_adapter = TypeAdapter(EmailStr)


@dataclass
class EmailSendResult:
    delivered: bool
    provider: str
    status: str = "skipped"


class EmailService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def send_staff_password_reset(self, *, recipient: str, reset_url: str, expires_minutes: int) -> EmailSendResult:
        subject = "Reset your ONIRIA City staff password"
        text = (
            "A password reset was requested for your ONIRIA City staff account.\n\n"
            f"Reset link: {reset_url}\n\n"
            f"This link expires in {expires_minutes} minutes. If you did not request it, ignore this message."
        )
        html = (
            "<p>A password reset was requested for your ONIRIA City staff account.</p>"
            f"<p><a href=\"{escape(reset_url)}\">Reset your password</a></p>"
            f"<p>This link expires in {expires_minutes} minutes. If you did not request it, ignore this message.</p>"
        )
        return await self._send_email(to=[recipient], subject=subject, text=text, html=html)

    async def send_sales_enquiry_notification(
        self,
        *,
        payload: EnquiryCreate,
        reference_number: str,
        lead_id: int,
        score: int,
    ) -> EmailSendResult:
        recipients = self.settings.sales_notification_recipient_list
        if not recipients:
            logger.info("sales notification skipped; no sales notification recipients configured")
            return EmailSendResult(delivered=False, provider=self._provider_name(), status="skipped")

        admin_url = f"{self.settings.frontend_url.rstrip('/')}/admin/leads/{lead_id}"
        subject = f"ONIRIA enquiry {reference_number}"
        rows = {
            "Reference number": reference_number,
            "Lead ID": str(lead_id),
            "Enquiry type": payload.enquiry_type.value,
            "Score": str(score),
            "Customer full name": payload.name,
            "Email": payload.email or "",
            "Phone": payload.phone or "",
            "Property interest": payload.property_slug or payload.collection_slug or "",
            "Budget": payload.budget or "",
            "Message": payload.message,
            "Admin lead URL": admin_url,
        }
        text = "\n".join(f"{label}: {value}" for label, value in rows.items() if value)
        html = "<table>" + "".join(
            f"<tr><th align=\"left\">{escape(label)}</th><td>{escape(value)}</td></tr>"
            for label, value in rows.items()
            if value
        ) + "</table>"
        reply_to = self._safe_reply_to(payload.email)
        return await self._send_email(to=recipients, subject=subject, text=text, html=html, reply_to=reply_to)

    async def send_test_email(self, *, recipient: str) -> EmailSendResult:
        return await self._send_email(
            to=[recipient],
            subject="ONIRIA City email test",
            text="This is a test email from ONIRIA City.",
            html="<p>This is a test email from ONIRIA City.</p>",
        )

    def _provider_name(self) -> str:
        return (self.settings.mail_provider or "").strip().lower() or "development_fallback"

    async def _send_email(
        self,
        *,
        to: list[str],
        subject: str,
        text: str,
        html: str,
        reply_to: str | None = None,
    ) -> EmailSendResult:
        provider = self._provider_name()
        if provider == "development_fallback":
            logger.info("email delivery skipped; MAIL_PROVIDER is not configured")
            return EmailSendResult(delivered=False, provider=provider, status="skipped")
        if provider != "resend":
            logger.warning("email delivery skipped; unsupported MAIL_PROVIDER configured")
            return EmailSendResult(delivered=False, provider=provider, status="skipped")
        return await self._send_resend(to=to, subject=subject, text=text, html=html, reply_to=reply_to)

    async def _send_resend(
        self,
        *,
        to: list[str],
        subject: str,
        text: str,
        html: str,
        reply_to: str | None,
    ) -> EmailSendResult:
        api_key = (self.settings.resend_api_key or "").strip()
        mail_from = self._from_address()
        if not api_key or not mail_from:
            logger.warning("Resend email skipped; RESEND_API_KEY and MAIL_FROM are required")
            return EmailSendResult(delivered=False, provider="resend", status="skipped")

        body: dict[str, Any] = {
            "from": mail_from,
            "to": to,
            "subject": subject,
            "text": text,
            "html": html,
        }
        if reply_to:
            body["reply_to"] = reply_to

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    "https://api.resend.com/emails",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json=body,
                )
            if 200 <= response.status_code < 300:
                return EmailSendResult(delivered=True, provider="resend", status="sent")
            logger.warning("Resend email failed", extra={"status_code": response.status_code})
        except httpx.HTTPError:
            logger.exception("Resend email request failed")
        return EmailSendResult(delivered=False, provider="resend", status="failed")

    def _from_address(self) -> str | None:
        if not self.settings.mail_from:
            return None
        name = (self.settings.mail_from_name or "").strip()
        return f"{name} <{self.settings.mail_from}>" if name else self.settings.mail_from

    def _safe_reply_to(self, value: str | None) -> str | None:
        if not value:
            return self.settings.reply_to_email
        try:
            email_adapter.validate_python(value)
        except Exception:
            return self.settings.reply_to_email
        return value
