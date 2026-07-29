from fastapi import APIRouter, Depends

from app.api.admin_dependencies import require_database, require_permission
from app.repositories.admin_repository import AdminRepository

router = APIRouter(prefix="/admin", tags=["admin dashboard"])


@router.get("/dashboard")
async def dashboard(database=Depends(require_database), staff=Depends(require_permission("admin:dashboard"))):
    return {"success": True, "data": await AdminRepository(database).dashboard()}


@router.get("/campaigns")
async def campaigns(database=Depends(require_database), staff=Depends(require_permission("campaigns:view"))):
    rows = await database.fetch("SELECT * FROM campaign_performance ORDER BY leads DESC")
    return {"success": True, "data": rows}


@router.get("/follow-ups")
async def follow_ups(database=Depends(require_database), staff=Depends(require_permission("admin:dashboard"))):
    rows = await database.fetch("SELECT * FROM sales_follow_up_queue ORDER BY is_overdue DESC, follow_up_due_at ASC")
    return {"success": True, "data": rows}
