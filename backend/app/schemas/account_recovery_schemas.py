from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


RECOVERY_REASONS = {
    "forgot_password",
    "forgot_staff_email",
    "email_address_changed",
    "no_access_to_registered_email",
    "account_locked",
    "other",
}

RECOVERY_STATUSES = {
    "pending",
    "under_review",
    "awaiting_verification",
    "approved",
    "resolved",
    "rejected",
}


class RecoveryRequestCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    known_email: EmailStr | None = None
    phone: str = Field(min_length=5, max_length=60)
    staff_identifier: str | None = Field(default=None, max_length=120)
    department: str | None = Field(default=None, max_length=120)
    claimed_role: str | None = Field(default=None, max_length=120)
    recovery_reason: str = Field(max_length=80)
    preferred_contact_method: str = Field(min_length=3, max_length=40)
    message: str | None = Field(default=None, max_length=2000)

    @field_validator("recovery_reason")
    @classmethod
    def validate_reason(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in RECOVERY_REASONS:
            raise ValueError("Invalid recovery reason.")
        return normalized


class RecoveryRequestUpdate(BaseModel):
    status: str | None = None
    resolution_note: str | None = Field(default=None, max_length=2000)

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.strip().lower()
        if normalized not in RECOVERY_STATUSES:
            raise ValueError("Invalid recovery status.")
        return normalized


class RecoveryAssignRequest(BaseModel):
    admin_id: int | None = None


class RecoveryResolveRequest(BaseModel):
    resolution_note: str = Field(min_length=3, max_length=2000)


class RecoveryRequestPublicResponse(BaseModel):
    reference_number: str
    message: str


class AccountRecoveryRequest(BaseModel):
    id: int
    reference_number: str
    full_name: str
    known_email: str | None = None
    phone: str
    staff_identifier: str | None = None
    department: str | None = None
    claimed_role: str | None = None
    recovery_reason: str
    preferred_contact_method: str
    message: str | None = None
    status: str
    assigned_admin_id: int | None = None
    resolution_note: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    resolved_at: datetime | None = None
