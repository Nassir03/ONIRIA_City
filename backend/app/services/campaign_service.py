from app.schemas.enquiry_schemas import CampaignAttribution, EnquiryCreate


class CampaignService:
    def attribution_from_payload(self, payload: EnquiryCreate) -> CampaignAttribution:
        return payload.campaign
