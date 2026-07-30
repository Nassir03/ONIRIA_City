from __future__ import annotations

import asyncio
import sys
from pathlib import Path

try:
    import aiomysql
except ModuleNotFoundError:
    raise SystemExit("aiomysql is not installed. Run: backend\\.venv\\Scripts\\python.exe -m pip install -r backend\\requirements.txt")

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.config import get_settings


async def main() -> None:
    try:
        settings = get_settings()
    except Exception as exc:
        raise SystemExit(f"Settings validation failed: {exc}") from exc

    missing = []
    if not settings.mysql_connection_params:
        if settings.database_url:
            missing.append("valid DATABASE_URL")
        else:
            missing.extend(["MYSQL_HOST", "MYSQL_DATABASE", "MYSQL_USER", "MYSQL_PASSWORD"])
        print(f"Environment file: {settings.resolved_env_file}")
        raise SystemExit(f"Missing required environment values: {', '.join(missing)}")

    print(f"Environment file: {settings.resolved_env_file}")
    print(f"Configuration source: {settings.mysql_configuration_source}")
    print(f"Host: {settings.mysql_log_summary['mysql_host']}")
    print(f"Port: {settings.mysql_log_summary['mysql_port']}")
    print(f"Database: {settings.mysql_log_summary['mysql_database']}")
    print(f"User: {settings.mysql_log_summary['mysql_user']}")

    try:
        connection = await aiomysql.connect(**settings.mysql_connection_params)
    except Exception as exc:
        raise SystemExit(f"Connection: failed ({exc.__class__.__name__})") from exc

    try:
        async with connection.cursor() as cursor:
            await cursor.execute("SELECT DATABASE(), COUNT(*) FROM staff_roles")
            row = await cursor.fetchone()
            print("Connection: successful")
            print(f"staff_roles: {row[1]}")
    finally:
        connection.close()


if __name__ == "__main__":
    asyncio.run(main())
