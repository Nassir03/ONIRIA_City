import hashlib
import hmac
import logging

logger = logging.getLogger(__name__)


class WhatsAppService:
    def __init__(self, app_secret: str | None = None) -> None:
        self.app_secret = app_secret

    def verify_signature(self, body: bytes, signature_header: str | None) -> bool:
        if not self.app_secret:
            logger.warning("WHATSAPP_APP_SECRET is not configured; accepting webhook in demo mode")
            return True
        if not signature_header or not signature_header.startswith("sha256="):
            return False
        expected = hmac.new(self.app_secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
        received = signature_header.removeprefix("sha256=")
        return hmac.compare_digest(expected, received)

    def process_payload(self, payload: dict) -> int:
        count = 0
        for entry in payload.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                count += len(value.get("messages", []))
        logger.info("whatsapp webhook processed", extra={"processed_messages": count})
        return count
