import logging

from app.schemas.enquiry_schemas import EnquiryCreate

logger = logging.getLogger(__name__)


class NotificationService:
    async def notify_sales_team(self, *, payload: EnquiryCreate, reference_number: str, lead_id: int, score: int) -> str:
        logger.info(
            "sales notification queued",
            extra={
                "reference_number": reference_number,
                "lead_id": lead_id,
                "enquiry_type": payload.enquiry_type.value,
                "score": score,
            },
        )
        return "logged"
