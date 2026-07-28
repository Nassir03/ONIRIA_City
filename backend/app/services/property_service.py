from app.repositories.property_repository import PropertyRepository
from app.schemas.property_schemas import CollectionPublic, MasterplanZone, PaginatedProperties, PropertyDetail, SearchResult


class PropertyService:
    def __init__(self, repository: PropertyRepository) -> None:
        self.repository = repository

    async def list_properties(
        self,
        *,
        collection: str | None,
        property_type: str | None,
        zone: str | None,
        bedrooms: int | None,
        page: int,
        page_size: int,
    ) -> PaginatedProperties:
        items, total = await self.repository.list_properties(
            collection=collection,
            property_type=property_type,
            zone=zone,
            bedrooms=bedrooms,
            page=page,
            page_size=page_size,
        )
        return PaginatedProperties(items=items, page=page, page_size=page_size, total=total)

    async def get_property(self, slug: str) -> PropertyDetail | None:
        return await self.repository.get_property(slug)

    async def list_collections(self) -> list[CollectionPublic]:
        return await self.repository.list_collections()

    async def list_masterplan_zones(self) -> list[MasterplanZone]:
        return await self.repository.list_masterplan_zones()

    async def search(self, query: str, limit: int) -> list[SearchResult]:
        return await self.repository.search(query, limit)
