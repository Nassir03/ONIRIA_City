from __future__ import annotations

import asyncio
import sys
from pathlib import Path

try:
    import aiomysql
except ModuleNotFoundError:
    aiomysql = None

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.config import get_settings
from migration_manifest import MYSQL_MIGRATION_FILES

ROOT = BACKEND_DIR.parent
REQUIRED_TABLES = (
    "staff_users",
    "staff_roles",
    "staff_user_roles",
    "staff_sessions",
    "customers",
    "leads",
    "enquiries",
    "lead_activities",
    "brochure_requests",
    "consultations",
    "site_visits",
    "newsletter_subscriptions",
    "audit_logs",
)


def print_check(label: str, ok: bool, detail: str | None = None) -> None:
    suffix = f" ({detail})" if detail else ""
    print(f"{label}: {'yes' if ok else 'no'}{suffix}")


async def table_exists(cursor, table_name: str) -> bool:
    await cursor.execute(
        """
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = DATABASE() AND table_name = %s
        """,
        (table_name,),
    )
    row = await cursor.fetchone()
    return bool(row and row[0])


async def main() -> int:
    if aiomysql is None:
        print("aiomysql installed: no")
        return 1

    settings = get_settings()
    params = settings.mysql_connection_params
    print(f"Environment file: {settings.resolved_env_file}")
    print(f"Configuration source: {settings.mysql_configuration_source}")
    summary = settings.mysql_log_summary
    print(f"Host: {summary.get('mysql_host')}")
    print(f"Port: {summary.get('mysql_port')}")
    print(f"Database: {summary.get('mysql_database')}")
    print(f"User: {summary.get('mysql_user')}")

    migration_dir = ROOT / "database" / "migrations"
    missing_migrations = [name for name in MYSQL_MIGRATION_FILES if not (migration_dir / name).exists()]
    print_check("Active migration files present", not missing_migrations, f"{len(MYSQL_MIGRATION_FILES)} expected")
    if missing_migrations:
        print(f"Missing migration files: {', '.join(missing_migrations)}")
        return 1

    if not params:
        print("MySQL configuration complete: no")
        return 1

    try:
        connection = await aiomysql.connect(**params)
    except Exception as exc:
        print(f"MySQL reachable: no ({exc.__class__.__name__})")
        return 1

    try:
        async with connection.cursor() as cursor:
            print_check("MySQL reachable", True)
            table_results = {}
            for table in REQUIRED_TABLES:
                table_results[table] = await table_exists(cursor, table)
            print_check("Required tables exist", all(table_results.values()))
            for table, exists in table_results.items():
                print_check(f"Table {table}", exists)

            admin_email = settings.oniria_admin_email
            if admin_email:
                await cursor.execute(
                    """
                    SELECT su.is_active,
                           COUNT(sr.id) AS administrator_roles
                    FROM staff_users su
                    LEFT JOIN staff_user_roles sur ON sur.staff_user_id = su.id
                    LEFT JOIN staff_roles sr ON sr.id = sur.role_id AND sr.role_key = 'administrator'
                    WHERE LOWER(su.email) = LOWER(%s)
                    GROUP BY su.id, su.is_active
                    LIMIT 1
                    """,
                    (admin_email,),
                )
                admin = await cursor.fetchone()
                print_check("Administrator exists", bool(admin))
                print_check("Administrator active", bool(admin and admin[0]))
                print_check("Administrator role assigned", bool(admin and admin[1]))
            else:
                print_check("Administrator email configured", False)

            print_check("Newsletter table available", table_results.get("newsletter_subscriptions", False))
            print_check("Enquiry dependencies available", all(table_results.get(table, False) for table in ("customers", "leads", "enquiries", "lead_activities")))
            resend_enabled = (settings.mail_provider or "").lower() == "resend"
            resend_ready = bool(settings.resend_api_key and settings.mail_from and settings.sales_notification_recipient_list)
            print_check("Resend enabled", resend_enabled)
            if resend_enabled:
                print_check("Resend configuration complete", resend_ready)
    finally:
        connection.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
