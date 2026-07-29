from typing import Annotated

from fastapi import APIRouter, Depends

from app.database import db
from app.repositories.knowledge_repository import KnowledgeRepository
from app.schemas.ai_schemas import AIChatRequest
from app.services.ai_service import AIService
from app.services.knowledge_service import KnowledgeService

router = APIRouter(tags=["oniria ai"])


def get_ai_service() -> AIService:
    repository = KnowledgeRepository(db if db.is_configured else None)
    return AIService(KnowledgeService(repository))


@router.post("/ai/chat")
async def chat(payload: AIChatRequest, service: Annotated[AIService, Depends(get_ai_service)]):
    result = await service.chat(payload)
    return {"success": True, "data": result.model_dump()}
