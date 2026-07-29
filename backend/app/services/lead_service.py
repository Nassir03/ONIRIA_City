from app.repositories.lead_repository import LeadRepository
from app.schemas.enquiry_schemas import EnquiryCreate, EnquiryResponse, LeadDetail, LeadSummary
from app.services.campaign_service import CampaignService
from app.services.notification_service import NotificationService
from app.utils.reference_number import make_reference_number


class LeadService:
    def __init__(
        self,
        repository: LeadRepository,
        campaign_service: CampaignService,
        notification_service: NotificationService,
    ) -> None:
        self.repository = repository
        self.campaign_service = campaign_service
        self.notification_service = notification_service

    async def process_enquiry(self, payload: EnquiryCreate) -> EnquiryResponse:
        lead = await self.repository.find_or_create_lead(payload)
        score = self.calculate_score(payload)
        follow_up_status = self.follow_up_status(score)
        sequence = await self.repository.next_reference_sequence()
        reference_number = make_reference_number(sequence)
        campaign = self.campaign_service.attribution_from_payload(payload)
        notification_status = await self.notification_service.notify_sales_team(
            payload=payload,
            reference_number=reference_number,
            lead_id=lead["id"],
            score=score,
        )
        await self.repository.save_enquiry_activity(
            lead=lead,
            payload=payload,
            reference_number=reference_number,
            score=score,
            follow_up_status=follow_up_status,
            campaign=campaign,
            notification_status=notification_status,
        )
        return EnquiryResponse(
            reference_number=reference_number,
            lead_id=lead["id"],
            lead_score=score,
            follow_up_status=follow_up_status,
            message="Thank you. The ONIRIA City sales team will follow up with you.",
        )

    async def list_leads(self) -> list[LeadSummary]:
        return await self.repository.list_leads()

    async def get_lead(self, lead_id: int) -> LeadDetail | None:
        return await self.repository.get_lead(lead_id)

    def calculate_score(self, payload: EnquiryCreate) -> int:
        score = 10
        if payload.property_slug:
            score += 20
        if payload.collection_slug:
            score += 10
        if payload.budget:
            score += 15
        if payload.purchase_timeline in {"immediately", "1-3_months"}:
            score += 25
        elif payload.purchase_timeline == "3-6_months":
            score += 15
        if payload.enquiry_type == "brochure":
            score += 10
        elif payload.enquiry_type == "consultation":
            score += 25
        elif payload.enquiry_type == "site_visit":
            score += 35
        elif payload.enquiry_type == "commercial":
            score += 20
        return min(score, 100)

    def follow_up_status(self, score: int) -> str:
        if score >= 70:
            return "priority_follow_up"
        if score >= 40:
            return "sales_follow_up"
        return "nurture"
