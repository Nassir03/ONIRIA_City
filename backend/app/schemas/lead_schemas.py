from datetime import datetime

from pydantic import BaseModel, Field


class LeadPatchRequest(BaseModel):
    lead_status: str | None = Field(default=None, max_length=80)
    next_follow_up_at: datetime | None = None
    last_contacted_at: datetime | None = None


class LeadAssignRequest(BaseModel):
    staff_id: int


class LeadNoteRequest(BaseModel):
    note: str = Field(min_length=2, max_length=3000)


class LeadFollowUpRequest(BaseModel):
    due_at: datetime
    assigned_to_staff_id: int | None = None
    outcome: str | None = Field(default=None, max_length=1000)


class LeadActivityRequest(BaseModel):
    activity_type: str = Field(min_length=2, max_length=80)
    summary: str = Field(min_length=2, max_length=1000)
