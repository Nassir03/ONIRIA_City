from fastapi import APIRouter, Depends

from app.api.admin_dependencies import require_database, require_permission
from app.repositories.admin_repository import AdminRepository

router = APIRouter(prefix="/admin", tags=["admin enquiries"])


@router.get("/enquiries")
async def enquiries(database=Depends(require_database), staff=Depends(require_permission("leads:view_all"))):
    return {"success": True, "data": await AdminRepository(database).list_by_enquiry_type()}


@router.get("/brochure-requests")
async def brochure_requests(database=Depends(require_database), staff=Depends(require_permission("leads:view_all"))):
    return {"success": True, "data": await AdminRepository(database).list_by_enquiry_type("brochure")}


@router.get("/consultations")
async def consultations(database=Depends(require_database), staff=Depends(require_permission("leads:view_all"))):
    return {"success": True, "data": await AdminRepository(database).list_by_enquiry_type("consultation")}


@router.get("/site-visits")
async def site_visits(database=Depends(require_database), staff=Depends(require_permission("leads:view_all"))):
    return {"success": True, "data": await AdminRepository(database).list_by_enquiry_type("site_visit")}
