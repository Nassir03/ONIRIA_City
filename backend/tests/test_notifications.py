import pytest
import asyncio

from app.repositories.lead_repository import LeadRepository, store
from app.schemas.enquiry_schemas import EnquiryCreate
from app.services.lead_service import LeadService
from app.services.campaign_service import CampaignService
from app.services.email_service import EmailSendResult
from app.services.notification_service import NotificationService


class FakeEmailService:
    def __init__(self) -> None:
        self.calls = []

    async def send_sales_enquiry_notification(self, **kwargs):
        self.calls.append(kwargs)
        return EmailSendResult(delivered=True, provider="fake", status="sent")


def setup_function():
    store.reset()


def test_enquiry_persists_before_fake_email_notification_attempt():
    asyncio.run(_run_enquiry_persistence_test())


async def _run_enquiry_persistence_test():
    fake_email = FakeEmailService()
    service = LeadService(
        repository=LeadRepository(),
        campaign_service=CampaignService(),
        notification_service=NotificationService(email_service=fake_email),
    )
    payload = EnquiryCreate(
        enquiry_type="property",
        name="Amina Hassan",
        email="amina@example.com",
        phone="+255712345678",
        message="I would like more details.",
        property_slug="skyline-villa",
        budget="USD 500k-750k",
        consent=True,
    )

    result = await service.process_enquiry(payload)

    assert result.reference_number.startswith("ON-")
    assert store.enquiries[0]["reference_number"] == result.reference_number
    assert store.enquiries[0]["notification_status"] == "sent"
    assert store.activities[0]["lead_id"] == result.lead_id
    assert fake_email.calls[0]["reference_number"] == result.reference_number
