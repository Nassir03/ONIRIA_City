from pydantic import BaseModel, Field


class WhatsAppWebhookPayload(BaseModel):
    object: str | None = None
    entry: list[dict] = Field(default_factory=list)


class WhatsAppProcessResponse(BaseModel):
    received: bool
    processed_messages: int
