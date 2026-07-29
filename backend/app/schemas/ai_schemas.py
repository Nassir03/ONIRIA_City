from pydantic import BaseModel, Field


class AIChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=1000)
    anonymous_session_id: str | None = Field(default=None, max_length=120)
    conversation_id: str | None = Field(default=None, max_length=120)
    lead_id: int | None = None
    page_path: str | None = Field(default=None, max_length=300)


class SuggestedAction(BaseModel):
    label: str
    href: str


class AIChatResponse(BaseModel):
    answer: str
    confidence: float
    conversation_id: str
    source_document_ids: list[str]
    suggested_actions: list[SuggestedAction]
    escalated: bool = False
