from __future__ import annotations

from typing import Any

from app.schemas.property_schemas import CollectionPublic, MasterplanZone, PropertyDetail, PropertySummary, SearchResult


SEEDED_PROPERTIES: list[dict[str, Any]] = [
    {
        "id": 1,
        "slug": "skyline-villa",
        "title": "Skyline Villa",
        "collection": "Villa Collection",
        "zone": "Hillside Residences",
        "property_type": "villa",
        "bedrooms": 5,
        "price_label": "Available on request",
        "status": "published",
        "hero_image": "/media/properties/skyline-villa.jpg",
        "description": "A private family villa with elevated views, generous outdoor living, and direct access to ONIRIA City lifestyle amenities.",
        "features": ["Private garden", "Pool deck", "Family lounge", "Staff quarters"],
        "media": [{"type": "image", "url": "/media/properties/skyline-villa.jpg", "alt": "Skyline Villa exterior"}],
        "floor_plans": [{"name": "Five-bedroom villa", "bedrooms": 5, "size_sqm": 520, "url": "/media/floorplans/skyline-villa.pdf"}],
    },
    {
        "id": 2,
        "slug": "avenue-residence",
        "title": "Avenue Residence",
        "collection": "Residence Collection",
        "zone": "Central Living District",
        "property_type": "apartment",
        "bedrooms": 3,
        "price_label": "Available on request",
        "status": "published",
        "hero_image": "/media/properties/avenue-residence.jpg",
        "description": "A refined apartment residence designed for walkable access to retail, dining, wellness, and business services.",
        "features": ["Balcony", "Concierge", "Secure parking", "Shared wellness amenities"],
        "media": [{"type": "image", "url": "/media/properties/avenue-residence.jpg", "alt": "Avenue Residence living room"}],
        "floor_plans": [{"name": "Three-bedroom residence", "bedrooms": 3, "size_sqm": 210, "url": "/media/floorplans/avenue-residence.pdf"}],
    },
    {
        "id": 3,
        "slug": "v-avenue-retail-suite",
        "title": "V Avenue Retail Suite",
        "collection": "V Avenue",
        "zone": "V Avenue",
        "property_type": "commercial",
        "bedrooms": None,
        "price_label": "Leasing enquiries open",
        "status": "published",
        "hero_image": "/media/properties/v-avenue-retail-suite.jpg",
        "description": "A public-facing commercial suite positioned within ONIRIA City's retail and hospitality corridor.",
        "features": ["High-street frontage", "Flexible fit-out", "Service access", "Pedestrian traffic"],
        "media": [{"type": "image", "url": "/media/properties/v-avenue-retail-suite.jpg", "alt": "V Avenue retail frontage"}],
        "floor_plans": [{"name": "Commercial shell", "bedrooms": None, "size_sqm": 140, "url": "/media/floorplans/v-avenue-retail-suite.pdf"}],
    },
]

SEEDED_COLLECTIONS = [
    {
        "slug": "villa-collection",
        "title": "Villa Collection",
        "description": "Private homes with generous plots, garden living, and family-scale layouts.",
        "property_count": 1,
    },
    {
        "slug": "residence-collection",
        "title": "Residence Collection",
        "description": "Elegant apartments and residences close to daily city amenities.",
        "property_count": 1,
    },
    {
        "slug": "v-avenue",
        "title": "V Avenue",
        "description": "Retail, hospitality, and commercial opportunities in the city corridor.",
        "property_count": 1,
    },
]

SEEDED_ZONES = [
    {
        "slug": "hillside-residences",
        "title": "Hillside Residences",
        "description": "Low-density residential living with privacy, greenery, and long views.",
        "related_collections": ["Villa Collection"],
    },
    {
        "slug": "central-living-district",
        "title": "Central Living District",
        "description": "Walkable residential streets connected to wellness, retail, and services.",
        "related_collections": ["Residence Collection"],
    },
    {
        "slug": "v-avenue",
        "title": "V Avenue",
        "description": "The commercial and lifestyle spine of ONIRIA City.",
        "related_collections": ["V Avenue"],
    },
]


class PropertyRepository:
    def __init__(self, pool: Any | None = None) -> None:
        self.pool = pool

    async def list_properties(
        self,
        *,
        collection: str | None,
        property_type: str | None,
        zone: str | None,
        bedrooms: int | None,
        page: int,
        page_size: int,
    ) -> tuple[list[PropertySummary], int]:
        if self.pool:
            return await self._list_properties_db(collection, property_type, zone, bedrooms, page, page_size)

        items = [item for item in SEEDED_PROPERTIES if item["status"] == "published"]
        if collection:
            items = [item for item in items if item["collection"].lower().replace(" ", "-") == collection]
        if property_type:
            items = [item for item in items if item["property_type"] == property_type]
        if zone:
            items = [item for item in items if item["zone"].lower().replace(" ", "-") == zone]
        if bedrooms is not None:
            items = [item for item in items if item["bedrooms"] == bedrooms]

        total = len(items)
        start = (page - 1) * page_size
        end = start + page_size
        return [PropertySummary(**item) for item in items[start:end]], total

    async def get_property(self, slug: str) -> PropertyDetail | None:
        if self.pool:
            return await self._get_property_db(slug)
        for item in SEEDED_PROPERTIES:
            if item["slug"] == slug and item["status"] == "published":
                return PropertyDetail(**item)
        return None

    async def list_collections(self) -> list[CollectionPublic]:
        if self.pool:
            rows = await self.pool.fetch(
                """
                SELECT slug, title, description, property_count
                FROM public_collections
                WHERE status = 'published'
                ORDER BY sort_order, title
                """
            )
            return [CollectionPublic(**dict(row)) for row in rows]
        return [CollectionPublic(**item) for item in SEEDED_COLLECTIONS]

    async def list_masterplan_zones(self) -> list[MasterplanZone]:
        if self.pool:
            rows = await self.pool.fetch(
                """
                SELECT slug, title, description, related_collections
                FROM public_masterplan_zones
                WHERE status = 'published'
                ORDER BY sort_order, title
                """
            )
            return [MasterplanZone(**dict(row)) for row in rows]
        return [MasterplanZone(**item) for item in SEEDED_ZONES]

    async def search(self, query: str, limit: int) -> list[SearchResult]:
        if self.pool:
            return await self._search_db(query, limit)

        needle = query.lower()
        results: list[SearchResult] = []
        for item in SEEDED_PROPERTIES:
            haystack = " ".join([item["title"], item["collection"], item["zone"], item["property_type"], item["description"]]).lower()
            if needle in haystack:
                results.append(SearchResult(type="property", title=item["title"], slug=item["slug"], excerpt=item["description"]))
        for item in SEEDED_COLLECTIONS:
            if needle in f"{item['title']} {item['description']}".lower():
                results.append(SearchResult(type="collection", title=item["title"], slug=item["slug"], excerpt=item["description"]))
        for item in SEEDED_ZONES:
            if needle in f"{item['title']} {item['description']}".lower():
                results.append(SearchResult(type="masterplan_zone", title=item["title"], slug=item["slug"], excerpt=item["description"]))
        return results[:limit]

    async def _list_properties_db(
        self,
        collection: str | None,
        property_type: str | None,
        zone: str | None,
        bedrooms: int | None,
        page: int,
        page_size: int,
    ) -> tuple[list[PropertySummary], int]:
        assert self.pool is not None
        rows = await self.pool.fetch(
            """
            SELECT id, slug, title, collection, zone, property_type, bedrooms, price_label, status, hero_image,
                   COUNT(*) OVER() AS total_count
            FROM public_properties
            WHERE status = 'published'
              AND ($1::text IS NULL OR collection_slug = $1)
              AND ($2::text IS NULL OR property_type = $2)
              AND ($3::text IS NULL OR zone_slug = $3)
              AND ($4::int IS NULL OR bedrooms = $4)
            ORDER BY sort_order, title
            LIMIT $5 OFFSET $6
            """,
            collection,
            property_type,
            zone,
            bedrooms,
            page_size,
            (page - 1) * page_size,
        )
        total = rows[0]["total_count"] if rows else 0
        return [PropertySummary(**{key: row[key] for key in PropertySummary.model_fields}) for row in rows], total

    async def _get_property_db(self, slug: str) -> PropertyDetail | None:
        assert self.pool is not None
        row = await self.pool.fetchrow(
            """
            SELECT id, slug, title, collection, zone, property_type, bedrooms, price_label, status,
                   hero_image, description, features, media, floor_plans
            FROM public_properties
            WHERE slug = $1 AND status = 'published'
            """,
            slug,
        )
        return PropertyDetail(**dict(row)) if row else None

    async def _search_db(self, query: str, limit: int) -> list[SearchResult]:
        assert self.pool is not None
        rows = await self.pool.fetch(
            """
            SELECT type, title, slug, excerpt
            FROM public_search_index
            WHERE status = 'published'
              AND search_vector @@ plainto_tsquery('english', $1)
            ORDER BY ts_rank(search_vector, plainto_tsquery('english', $1)) DESC
            LIMIT $2
            """,
            query,
            limit,
        )
        return [SearchResult(**dict(row)) for row in rows]
