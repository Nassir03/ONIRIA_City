import logging
from typing import Any
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from app.config import Settings

logger = logging.getLogger(__name__)

try:
    import asyncpg
except ModuleNotFoundError:
    asyncpg = None


class Database:
    def __init__(self) -> None:
        self.pool: Any | None = None

    async def connect(self, settings: Settings) -> None:
        if not settings.database_url:
            logger.warning("DATABASE_URL is not configured; using seeded public content data")
            return
        if asyncpg is None:
            raise RuntimeError("asyncpg is required when DATABASE_URL is configured")

        self.pool = await asyncpg.create_pool(
            dsn=str(settings.database_url),
            min_size=settings.database_min_size,
            max_size=settings.database_max_size,
            command_timeout=30,
        )
        logger.info("PostgreSQL connection pool established")

    async def disconnect(self) -> None:
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("PostgreSQL connection pool closed")

    async def healthcheck(self) -> bool:
        if not self.pool:
            return False
        async with self.pool.acquire() as connection:
            result = await connection.fetchval("SELECT 1")
            return result == 1

    @asynccontextmanager
    async def transaction(self) -> AsyncIterator[Any]:
        if not self.pool:
            raise RuntimeError("Database pool is not configured")
        async with self.pool.acquire() as connection:
            async with connection.transaction():
                yield connection


db = Database()
