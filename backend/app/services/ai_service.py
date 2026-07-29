from uuid import uuid4

from app.schemas.ai_schemas import AIChatRequest, AIChatResponse, SuggestedAction
from app.services.knowledge_service import KnowledgeService

ESCALATION_TERMS = {
    "price",
    "prices",
    "discount",
    "payment",
    "availability",
    "reservation",
    "legal",
    "tax",
    "contract",
    "guaranteed return",
    "complaint",
    "dispute",
}


class AIService:
    def __init__(self, knowledge_service: KnowledgeService) -> None:
        self.knowledge_service = knowledge_service

    async def chat(self, payload: AIChatRequest) -> AIChatResponse:
        question = payload.question.strip()
        conversation_id = payload.conversation_id or f"conv-{uuid4()}"
        if self._should_escalate(question):
            return AIChatResponse(
                answer="This question needs confirmation from the ONIRIA sales team. Please submit an inquiry so a representative can provide approved current information.",
                confidence=0.95,
                conversation_id=conversation_id,
                source_document_ids=[],
                suggested_actions=[
                    SuggestedAction(label="Submit an inquiry", href="/inquiries"),
                    SuggestedAction(label="Continue on WhatsApp", href="https://wa.me/255000000000"),
                ],
                escalated=True,
            )

        chunks = await self.knowledge_service.retrieve(question)
        if not chunks:
            return AIChatResponse(
                answer="I do not have an approved public ONIRIA source for that question yet. Please contact the team for verified information.",
                confidence=0.3,
                conversation_id=conversation_id,
                source_document_ids=[],
                suggested_actions=[SuggestedAction(label="Contact ONIRIA", href="/contact")],
                escalated=True,
            )

        primary = chunks[0]
        actions = primary.get("actions") or [{"label": "Make an inquiry", "href": "/inquiries"}]
        return AIChatResponse(
            answer=primary["answer"],
            confidence=0.82,
            conversation_id=conversation_id,
            source_document_ids=[chunk["document_id"] for chunk in chunks],
            suggested_actions=[SuggestedAction(**action) for action in actions],
            escalated=False,
        )

    def _should_escalate(self, question: str) -> bool:
        normalized = question.lower()
        return any(term in normalized for term in ESCALATION_TERMS)
