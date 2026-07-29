from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ValidateResetTokenRequest(BaseModel):
    token: str = Field(min_length=20, max_length=256)


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=20, max_length=256)
    new_password: str = Field(min_length=12, max_length=200)
    confirm_password: str = Field(min_length=12, max_length=200)


class AdminSessionStaff(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    roles: list[str]


class AdminSessionResponse(BaseModel):
    staff: AdminSessionStaff
    expires_at: datetime


class StaffCreateRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    password: str = Field(min_length=12, max_length=200)
    roles: list[str] = Field(default_factory=lambda: ["sales_agent"])


class StaffUpdateRequest(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=160)
    roles: list[str] | None = None
    is_active: bool | None = None
