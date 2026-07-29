from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.admin_dependencies import require_database, require_permission
from app.repositories.admin_repository import AdminRepository
from app.schemas.lead_schemas import LeadActivityRequest, LeadAssignRequest, LeadFollowUpRequest, LeadNoteRequest, LeadPatchRequest

router = APIRouter(prefix="/admin/leads", tags=["admin leads"])


@router.get("")
async def list_leads(
    q: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    source: str | None = None,
    assigned: str | None = None,
    sort: str | None = "newest",
    page: int = 1,
    page_size: int = 20,
    database=Depends(require_database),
    staff=Depends(require_permission("leads:view_all")),
):
    result = await AdminRepository(database).list_leads(
        {"q": q, "status": status_filter, "source": source, "assigned": assigned, "sort": sort, "page": page, "page_size": page_size}
    )
    return {"success": True, "data": result}


@router.get("/{lead_id}")
async def get_lead(lead_id: int, database=Depends(require_database), staff=Depends(require_permission("leads:view_all"))):
    result = await AdminRepository(database).get_lead(lead_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return {"success": True, "data": result}


@router.patch("/{lead_id}")
async def update_lead(lead_id: int, payload: LeadPatchRequest, database=Depends(require_database), staff=Depends(require_permission("leads:update"))):
    result = await AdminRepository(database).update_lead(lead_id, payload.model_dump(exclude_none=True), staff["id"])
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return {"success": True, "data": result}


@router.post("/{lead_id}/assign")
async def assign_lead(lead_id: int, payload: LeadAssignRequest, database=Depends(require_database), staff=Depends(require_permission("leads:assign"))):
    await AdminRepository(database).assign(lead_id, payload.staff_id, staff["id"])
    return {"success": True, "data": await AdminRepository(database).get_lead(lead_id)}


@router.post("/{lead_id}/notes")
async def add_note(lead_id: int, payload: LeadNoteRequest, database=Depends(require_database), staff=Depends(require_permission("leads:update"))):
    await AdminRepository(database).add_note(lead_id, payload.note, staff["id"])
    return {"success": True, "data": await AdminRepository(database).get_lead(lead_id)}


@router.post("/{lead_id}/follow-up")
async def add_follow_up(lead_id: int, payload: LeadFollowUpRequest, database=Depends(require_database), staff=Depends(require_permission("leads:update"))):
    await AdminRepository(database).add_follow_up(lead_id, payload.due_at, payload.assigned_to_staff_id, payload.outcome, staff["id"])
    return {"success": True, "data": await AdminRepository(database).get_lead(lead_id)}


@router.post("/{lead_id}/activities")
async def add_activity(lead_id: int, payload: LeadActivityRequest, database=Depends(require_database), staff=Depends(require_permission("leads:update"))):
    await AdminRepository(database).add_activity(lead_id, payload.activity_type, payload.summary, staff["id"])
    return {"success": True, "data": await AdminRepository(database).get_lead(lead_id)}
