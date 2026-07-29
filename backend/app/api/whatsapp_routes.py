from fastapi import APIRouter, HTTPException, Request, status

from app.config import get_settings
from app.schemas.whatsapp_schemas import WhatsAppProcessResponse
from app.services.whatsapp_service import WhatsAppService

router = APIRouter(tags=["whatsapp"])


@router.get("/webhooks/whatsapp")
async def verify_whatsapp_webhook(request: Request):
    settings = get_settings()
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")
    if mode == "subscribe" and token == settings.whatsapp_verify_token and challenge:
        return int(challenge) if challenge.isdigit() else challenge
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Webhook verification failed")


@router.post("/webhooks/whatsapp")
async def process_whatsapp_webhook(request: Request):
    settings = get_settings()
    body = await request.body()
    service = WhatsAppService(settings.whatsapp_app_secret)
    if not service.verify_signature(body, request.headers.get("x-hub-signature-256")):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid WhatsApp signature")
    payload = await request.json()
    processed = service.process_payload(payload)
    result = WhatsAppProcessResponse(received=True, processed_messages=processed)
    return {"success": True, "data": result.model_dump()}
