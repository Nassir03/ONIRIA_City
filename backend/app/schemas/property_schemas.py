from typing import Literal

from pydantic import BaseModel, Field


class MediaItem(BaseModel):
    type: Literal["image", "video", "document"]
    url: str
    alt: str | None = None


class FloorPlan(BaseModel):
    name: str
    bedrooms: int | None = None
    size_sqm: int | None = None
    url: str | None = None


class PropertySummary(BaseModel):
    id: int
    slug: str
    title: str
    collection: str
    zone: str
    property_type: str
    bedrooms: int | None = None
    price_label: str | None = None
    status: str
    hero_image: str | None = None


class PropertyDetail(PropertySummary):
    description: str
    features: list[str] = Field(default_factory=list)
    media: list[MediaItem] = Field(default_factory=list)
    floor_plans: list[FloorPlan] = Field(default_factory=list)


class CollectionPublic(BaseModel):
    slug: str
    title: str
    description: str
    property_count: int


class MasterplanZone(BaseModel):
    slug: str
    title: str
    description: str
    related_collections: list[str] = Field(default_factory=list)


class PaginatedProperties(BaseModel):
    items: list[PropertySummary]
    page: int
    page_size: int
    total: int


class SearchResult(BaseModel):
    type: Literal["property", "collection", "masterplan_zone", "faq", "journal"]
    title: str
    slug: str
    excerpt: str
