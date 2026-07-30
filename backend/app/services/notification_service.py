import logging

from app.config import Settings, get_settings
from app.schemas.enquiry_schemas import EnquiryCreate
from app.services.email_service import EmailService

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self, settings: Settings | None = None, email_service: EmailService | None = None) -> None:
        self.settings = settings or get_settings()
        self.email_service = email_service or EmailService(self.settings)

    async def notify_sales_team(self, *, payload: EnquiryCreate, reference_number: str, lead_id: int, score: int) -> str:
        try:
            result = await self.email_service.send_sales_enquiry_notification(
                payload=payload,
                reference_number=reference_number,
                lead_id=lead_id,
                score=score,
            )
        except Exception:
            logger.exception("sales notification failed after enquiry persistence")
            return "failed"
        logger.info(
            "sales notification processed",
            extra={"reference_number": reference_number, "lead_id": lead_id, "status": result.status},
        )
        return result.status
