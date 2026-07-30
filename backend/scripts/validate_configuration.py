from __future__ import annotations

import asyncio
import sys
from pathlib import Path

try:
    import aiomysql
except ModuleNotFoundError:
    aiomysql = None

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config import MYSQL_SCHEMES, get_settings
from scripts.migration_manifest import MYSQL_MIGRATION_FILES, MYSQL_SEED_FILES

ROOT = Path(__file__).resolve().parents[2]


def check_static_configuration() -> list[str]:
    errors: list[str] = []
    try:
        settings = get_settings()
    except Exception as exc:
        return [f"settings validation failed: {exc}"]
    if settings.database_url:
        scheme = settings.database_url.split(":", 1)[0]
        if scheme not in MYSQL_SCHEMES:
            errors.append("effective database scheme is not MySQL")
    elif settings.has_mysql_connection_settings:
        pass
    else:
        errors.append("database is not configured")

    for file_name in MYSQL_MIGRATION_FILES:
        if not (ROOT / "database" / "migrations" / file_name).exists():
            errors.append(f"missing migration: {file_name}")
    for file_name in MYSQL_SEED_FILES:
        if not (ROOT / "database" / "seed" / file_name).exists():
            errors.append(f"missing seed: {file_name}")

    staff_roles = ROOT / "database" / "seed" / "staff_roles.sql"
    if "administrator" not in staff_roles.read_text(encoding="utf-8"):
        errors.append("staff_roles.sql does not contain administrator")

    if (settings.mail_provider or "").strip().lower() == "resend":
        required = {
            "RESEND_API_KEY": settings.resend_api_key,
            "MAIL_FROM": settings.mail_from,
            "SALES_NOTIFICATION_EMAIL or SALES_NOTIFICATION_EMAILS": settings.sales_notification_recipient_list,
        }
        for name, value in required.items():
            if not value:
                errors.append(f"missing email setting: {name}")
    return errors


async def check_database_configuration() -> list[str]:
    errors: list[str] = []
    try:
        settings = get_settings()
    except Exception:
        return []
    if aiomysql is None:
        return ["aiomysql is not installed"]
    if not all([settings.mysql_host, settings.mysql_database, settings.mysql_user, settings.mysql_password]):
        return ["MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER and MYSQL_PASSWORD are required for database validation"]

    connection = await aiomysql.connect(
        host=settings.mysql_host,
        port=settings.mysql_port,
        user=settings.mysql_user,
        password=settings.mysql_password,
        db=settings.mysql_database,
    )
    try:
        async with connection.cursor() as cursor:
            await cursor.execute("SELECT 1")
            await cursor.execute("SELECT id FROM staff_roles WHERE role_key = 'administrator' LIMIT 1")
            role = await cursor.fetchone()
            if not role:
                errors.append("administrator role is missing")
            if settings.oniria_admin_email:
                await cursor.execute("SELECT id, is_active FROM staff_users WHERE email = %s LIMIT 1", (settings.oniria_admin_email.lower(),))
                staff = await cursor.fetchone()
                if not staff:
                    errors.append("configured admin does not exist")
                elif not bool(staff[1]):
                    errors.append("configured admin is inactive")
                elif role:
                    await cursor.execute(
                        """
                        SELECT 1
                        FROM staff_user_roles
                        WHERE staff_user_id = %s AND role_id = %s
                        LIMIT 1
                        """,
                        (staff[0], role[0]),
                    )
                    if not await cursor.fetchone():
                        errors.append("configured admin is missing administrator role")
            else:
                errors.append("ONIRIA_ADMIN_EMAIL is not configured")
    finally:
        connection.close()
    return errors


async def main() -> None:
    errors = check_static_configuration()
    errors.extend(await check_database_configuration())
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        raise SystemExit(1)
    print("Configuration validation passed.")


if __name__ == "__main__":
    asyncio.run(main())
