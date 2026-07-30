import logging
import asyncio
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any
from urllib.parse import unquote, urlparse

from app.config import Settings

logger = logging.getLogger(__name__)

try:
    import aiomysql
except ModuleNotFoundError:
    aiomysql = None


class Database:
    def __init__(self) -> None:
        self.pool: Any | None = None

    @property
    def is_configured(self) -> bool:
        return self.pool is not None

    async def connect(self, settings: Settings) -> None:
        if not settings.database_url and not settings.has_mysql_connection_settings:
            logger.warning("DATABASE_URL is not configured; using seeded public content data")
            return
        if aiomysql is None:
            raise RuntimeError("aiomysql is required when DATABASE_URL is configured")

        parsed_url = self._parse_mysql_url(settings.database_url) if settings.database_url else settings.mysql_connection_params
        if not parsed_url:
            logger.warning("MySQL settings are incomplete; using seeded public content data")
            return
        logger.info(
            "MySQL configuration loaded",
            extra={
                **settings.mysql_log_summary,
                "env_file": str(settings.resolved_env_file),
                "configuration_source": settings.mysql_configuration_source,
            },
        )
        last_error: Exception | None = None
        for attempt in range(1, 11):
            try:
                self.pool = await aiomysql.create_pool(
                    **parsed_url,
                    minsize=settings.database_min_size,
                    maxsize=max(settings.database_max_size, settings.mysql_pool_size),
                    autocommit=True,
                    charset="utf8mb4",
                )
                break
            except Exception as exc:
                last_error = exc
                logger.warning(
                    "MySQL connection attempt %s failed: %s",
                    attempt,
                    self._safe_connection_error(exc),
                )
                await asyncio.sleep(2)
        if not self.pool:
            detail = self._safe_connection_error(last_error)
            raise RuntimeError(f"Could not connect to MySQL: {detail}") from last_error
        logger.info(
            "MySQL connection pool established",
            extra={
                **settings.mysql_log_summary,
                "env_file": str(settings.resolved_env_file),
                "configuration_source": settings.mysql_configuration_source,
            },
        )

    async def disconnect(self) -> None:
        if self.pool:
            self.pool.close()
            await self.pool.wait_closed()
            self.pool = None
            logger.info("MySQL connection pool closed")

    async def healthcheck(self) -> bool:
        if not self.pool:
            return False
        result = await self.fetchval("SELECT 1")
        return result == 1

    async def fetch(self, query: str, *params: Any) -> list[dict[str, Any]]:
        if not self.pool:
            raise RuntimeError("Database pool is not configured")
        async with self.pool.acquire() as connection:
            async with connection.cursor(aiomysql.DictCursor) as cursor:
                await cursor.execute(query, params)
                return list(await cursor.fetchall())

    async def fetchrow(self, query: str, *params: Any) -> dict[str, Any] | None:
        if not self.pool:
            raise RuntimeError("Database pool is not configured")
        async with self.pool.acquire() as connection:
            async with connection.cursor(aiomysql.DictCursor) as cursor:
                await cursor.execute(query, params)
                return await cursor.fetchone()

    async def fetchval(self, query: str, *params: Any) -> Any:
        if not self.pool:
            raise RuntimeError("Database pool is not configured")
        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, params)
                row = await cursor.fetchone()
                return row[0] if row else None

    async def insert_and_get_id(self, query: str, *params: Any) -> int:
        if not self.pool:
            raise RuntimeError("Database pool is not configured")
        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                await cursor.execute(query, params)
                return int(cursor.lastrowid)

    async def execute(self, query: str, *params: Any) -> int:
        if not self.pool:
            raise RuntimeError("Database pool is not configured")
        async with self.pool.acquire() as connection:
            async with connection.cursor() as cursor:
                return await cursor.execute(query, params)

    @asynccontextmanager
    async def transaction(self) -> AsyncIterator[Any]:
        if not self.pool:
            raise RuntimeError("Database pool is not configured")
        async with self.pool.acquire() as connection:
            await connection.begin()
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise
            else:
                await connection.commit()

    def _parse_mysql_url(self, database_url: str) -> dict[str, Any]:
        parsed = urlparse(database_url)
        if parsed.scheme not in {"mysql", "mysql+pymysql", "mysql+aiomysql"}:
            raise ValueError("DATABASE_URL must use mysql://, mysql+pymysql://, or mysql+aiomysql://")
        if not parsed.hostname or not parsed.path.strip("/"):
            raise ValueError("DATABASE_URL must include host and database name")
        return {
            "host": parsed.hostname,
            "port": parsed.port or 3306,
            "user": unquote(parsed.username or ""),
            "password": unquote(parsed.password or ""),
            "db": parsed.path.lstrip("/"),
        }

    def _safe_connection_error(self, exc: Exception | None) -> str:
        if exc is None:
            return "unknown connection error"
        message = str(exc)
        if "Access denied" in message:
            return "access denied for configured MySQL user; check MYSQL_USER, MYSQL_PASSWORD, host and port"
        if "Can't connect" in message or "Connect call failed" in message:
            return "could not reach MySQL server; check MYSQL_HOST and MYSQL_PORT"
        if "Unknown database" in message:
            return "configured MySQL database does not exist"
        return exc.__class__.__name__


db = Database()
