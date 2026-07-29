from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field, field_validator


class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr
    consent: bool
    source_page: str | None = Field(default=None, max_length=255)
    anonymous_session_id: str | None = Field(default=None, max_length=120)
    utm_source: str | None = Field(default=None, max_length=120)
    utm_medium: str | None = Field(default=None, max_length=120)
    utm_campaign: str | None = Field(default=None, max_length=160)
    utm_content: str | None = Field(default=None, max_length=160)

    @field_validator("consent")
    @classmethod
    def require_consent(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Consent is required to subscribe.")
        return value


class NewsletterUnsubscribeRequest(BaseModel):
    email: EmailStr


class SubscriberListFilters(BaseModel):
    q: str | None = Field(default=None, max_length=160)
    status: str | None = Field(default=None, max_length=40)
    campaign: str | None = Field(default=None, max_length=160)
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=25, ge=1, le=100)
