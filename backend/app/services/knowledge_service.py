from app.repositories.knowledge_repository import KnowledgeRepository


class KnowledgeService:
    def __init__(self, repository: KnowledgeRepository) -> None:
        self.repository = repository

    async def retrieve(self, question: str) -> list[dict]:
        return await self.repository.retrieve_public_approved_chunks(question)
