from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.admin_dependencies import require_permission
from app.database import db
from app.repositories.lead_repository import LeadRepository
from app.schemas.enquiry_schemas import (
    BrochureRequestCreate,
    ConsultationRequestCreate,
    EnquiryCreate,
    EnquiryType,
    SiteVisitRequestCreate,
)
from app.services.campaign_service import CampaignService
from app.services.lead_service import LeadService
from app.services.notification_service import NotificationService

router = APIRouter(tags=["enquiries"])
internal_router = APIRouter(tags=["internal leads"])


def get_lead_service() -> LeadService:
    return LeadService(
        repository=LeadRepository(db if db.is_configured else None),
        campaign_service=CampaignService(),
        notification_service=NotificationService(),
    )


@router.post("/enquiries", status_code=status.HTTP_201_CREATED)
async def create_enquiry(payload: EnquiryCreate, service: Annotated[LeadService, Depends(get_lead_service)]):
    result = await service.process_enquiry(payload)
    return {"success": True, "data": result.model_dump()}


@router.post("/brochure-requests", status_code=status.HTTP_201_CREATED)
async def create_brochure_request(payload: BrochureRequestCreate, service: Annotated[LeadService, Depends(get_lead_service)]):
    payload.enquiry_type = EnquiryType.brochure
    result = await service.process_enquiry(payload)
    return {"success": True, "data": result.model_dump()}


@router.post("/consultations", status_code=status.HTTP_201_CREATED)
async def create_consultation(payload: ConsultationRequestCreate, service: Annotated[LeadService, Depends(get_lead_service)]):
    payload.enquiry_type = EnquiryType.consultation
    result = await service.process_enquiry(payload)
    return {"success": True, "data": result.model_dump()}


@router.post("/site-visits", status_code=status.HTTP_201_CREATED)
async def create_site_visit(payload: SiteVisitRequestCreate, service: Annotated[LeadService, Depends(get_lead_service)]):
    payload.enquiry_type = EnquiryType.site_visit
    result = await service.process_enquiry(payload)
    return {"success": True, "data": result.model_dump()}


@router.post("/commercial-enquiries", status_code=status.HTTP_201_CREATED)
async def create_commercial_enquiry(payload: EnquiryCreate, service: Annotated[LeadService, Depends(get_lead_service)]):
    payload.enquiry_type = EnquiryType.commercial
    result = await service.process_enquiry(payload)
    return {"success": True, "data": result.model_dump()}


@internal_router.get("/internal/leads")
async def list_leads(service: Annotated[LeadService, Depends(get_lead_service)], staff=Depends(require_permission("leads:view_all"))):
    result = await service.list_leads()
    return {"success": True, "data": [item.model_dump() for item in result]}


@internal_router.get("/internal/leads/{lead_id}")
async def get_lead(lead_id: int, service: Annotated[LeadService, Depends(get_lead_service)], staff=Depends(require_permission("leads:view_all"))):
    result = await service.get_lead(lead_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return {"success": True, "data": result.model_dump()}
