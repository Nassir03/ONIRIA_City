from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import db
from app.repositories.property_repository import PropertyRepository
from app.services.property_service import PropertyService
from app.utils.validators import normalize_slug

router = APIRouter(tags=["public properties"])


def get_property_service() -> PropertyService:
    return PropertyService(PropertyRepository(db.pool))


@router.get("/properties")
async def list_properties(
    service: Annotated[PropertyService, Depends(get_property_service)],
    collection: Annotated[str | None, Query(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")] = None,
    property_type: Annotated[str | None, Query(pattern=r"^[a-z0-9_-]+$")] = None,
    zone: Annotated[str | None, Query(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")] = None,
    bedrooms: Annotated[int | None, Query(ge=0, le=20)] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=50)] = 12,
):
    result = await service.list_properties(
        collection=collection,
        property_type=property_type,
        zone=zone,
        bedrooms=bedrooms,
        page=page,
        page_size=page_size,
    )
    return {"success": True, "data": result.model_dump()}


@router.get("/properties/{slug}")
async def get_property(slug: str, service: Annotated[PropertyService, Depends(get_property_service)]):
    safe_slug = normalize_slug(slug)
    result = await service.get_property(safe_slug)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    return {"success": True, "data": result.model_dump()}


@router.get("/collections")
async def list_collections(service: Annotated[PropertyService, Depends(get_property_service)]):
    result = await service.list_collections()
    return {"success": True, "data": [item.model_dump() for item in result]}


@router.get("/masterplan/zones")
async def list_masterplan_zones(service: Annotated[PropertyService, Depends(get_property_service)]):
    result = await service.list_masterplan_zones()
    return {"success": True, "data": [item.model_dump() for item in result]}
