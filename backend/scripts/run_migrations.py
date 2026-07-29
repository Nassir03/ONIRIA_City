from __future__ import annotations

import asyncio
import os
from pathlib import Path

try:
    import aiomysql
except ModuleNotFoundError:
    aiomysql = None


ROOT = Path(__file__).resolve().parents[2]
MIGRATIONS = ROOT / "database" / "migrations"
SEEDS = ROOT / "database" / "seed"
MYSQL_MIGRATION_FILES = (
    "001_database_setup.sql",
    "002_staff_security.sql",
    "003_property_catalogue.sql",
    "004_masterplan_amenities.sql",
    "005_anonymous_sessions.sql",
    "006_customers_leads.sql",
    "007_enquiries_requests.sql",
    "008_lead_operations.sql",
    "009_campaigns.sql",
    "010_conversations.sql",
    "011_knowledge.sql",
    "012_indexes_constraints.sql",
    "013_views.sql",
    "014_audit_logs.sql",
)


def mysql_settings(database: str | None = None) -> dict[str, object]:
    host = os.getenv("MYSQL_HOST", "127.0.0.1")
    port = os.getenv("MYSQL_PORT", "3306")
    user = os.getenv("MYSQL_USER")
    password = os.getenv("MYSQL_PASSWORD")
    if not user or not password:
        raise SystemExit("MYSQL_USER and MYSQL_PASSWORD are required. Put them in your local environment, not source code.")
    settings: dict[str, object] = {
        "host": host,
        "port": int(port),
        "user": user,
        "password": password,
        "charset": "utf8mb4",
        "autocommit": True,
    }
    if database:
        settings["db"] = database
    return settings


def split_mysql_script(sql_text: str) -> list[str]:
    statements: list[str] = []
    delimiter = ";"
    buffer: list[str] = []

    for raw_line in sql_text.splitlines():
        line = raw_line.strip()
        if not line:
            buffer.append(raw_line)
            continue
        if line.upper().startswith("DELIMITER "):
            pending = "\n".join(buffer).strip()
            if pending:
                statements.append(pending)
            buffer = []
            delimiter = line.split(maxsplit=1)[1]
            continue

        buffer.append(raw_line)
        current = "\n".join(buffer).strip()
        if current.endswith(delimiter):
            statements.append(current[: -len(delimiter)].strip())
            buffer = []

    pending = "\n".join(buffer).strip()
    if pending:
        statements.append(pending)
    return [statement for statement in statements if statement and any(not line.strip().startswith("--") for line in statement.splitlines())]


async def apply_sql(cursor, path: Path) -> None:
    print(f"Applying {path.relative_to(ROOT)}")
    sql_text = path.read_text(encoding="utf-8")
    for statement in split_mysql_script(sql_text):
        await cursor.execute(statement)


async def main() -> None:
    if aiomysql is None:
        raise SystemExit("aiomysql is not installed. Run: backend\\.venv\\Scripts\\python.exe -m pip install -r backend\\requirements.txt")

    connection = await aiomysql.connect(**mysql_settings())
    try:
        async with connection.cursor() as cursor:
            for file_name in MYSQL_MIGRATION_FILES:
                await apply_sql(cursor, MIGRATIONS / file_name)
            for seed_name in ("staff_roles.sql", "property_seed.sql", "masterplan_seed.sql"):
                seed_path = SEEDS / seed_name
                if seed_path.exists():
                    await apply_sql(cursor, seed_path)
    finally:
        connection.close()
    print("Migrations and safe seed data applied.")


def cli() -> None:
    for file_name in MYSQL_MIGRATION_FILES:
        path = MIGRATIONS / file_name
        if not path.exists():
            raise SystemExit(f"Missing migration file: {path}")
    asyncio.run(main())


if __name__ == "__main__":
    cli()
