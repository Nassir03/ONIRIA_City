from fastapi import APIRouter, Depends

from app.api.admin_dependencies import require_database, require_permission

router = APIRouter(prefix="/admin", tags=["admin conversations"])


@router.get("/conversations")
async def conversations(database=Depends(require_database), staff=Depends(require_permission("conversations:view"))):
    rows = await database.fetch("SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 100")
    return {"success": True, "data": rows}


@router.get("/whatsapp-conversations")
async def whatsapp_conversations(database=Depends(require_database), staff=Depends(require_permission("conversations:view"))):
    rows = await database.fetch("SELECT * FROM conversations WHERE channel = 'whatsapp' ORDER BY updated_at DESC LIMIT 100")
    return {"success": True, "data": rows}
