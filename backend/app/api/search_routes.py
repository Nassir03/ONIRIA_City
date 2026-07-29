from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.property_routes import get_property_service
from app.services.property_service import PropertyService
from app.utils.validators import reject_unsafe_text

router = APIRouter(tags=["public search"])


@router.get("/search")
async def search_public_content(
    service: Annotated[PropertyService, Depends(get_property_service)],
    q: Annotated[str, Query(min_length=2, max_length=120)],
    limit: Annotated[int, Query(ge=1, le=25)] = 10,
):
    safe_query = reject_unsafe_text(q, "q")
    result = await service.search(safe_query or "", limit)
    return {"success": True, "data": [item.model_dump() for item in result]}
