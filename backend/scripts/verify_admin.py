from __future__ import annotations

import asyncio
import sys
from pathlib import Path

try:
    import aiomysql
except ModuleNotFoundError:
    raise SystemExit("aiomysql is not installed. Run: backend\\.venv\\Scripts\\python.exe -m pip install -r backend\\requirements.txt")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config import get_settings
from app.services.admin_bootstrap_service import verify_administrator


async def main() -> None:
    try:
        settings = get_settings()
    except Exception as exc:
        raise SystemExit(f"Settings validation failed: {exc}") from exc
    connection_params = settings.mysql_connection_params
    if not connection_params:
        raise SystemExit("Required values are missing: DATABASE_URL or MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER and MYSQL_PASSWORD")
    if not settings.oniria_admin_email:
        raise SystemExit("Required values are missing: ONIRIA_ADMIN_EMAIL")

    try:
        connection = await aiomysql.connect(
            **connection_params,
        )
    except Exception as exc:
        raise SystemExit(f"Could not connect to MySQL: {exc}") from exc
    try:
        result = await verify_administrator(connection, str(settings.oniria_admin_email))
    finally:
        connection.close()

    print(f"Administrator email: {result.email}")
    print(f"Active: {'yes' if result.active else 'no'}")
    print(f"Administrator role: {'yes' if result.has_administrator_role else 'no'}")
    if not result.active or not result.has_administrator_role:
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
