from __future__ import annotations

import os
import subprocess
from pathlib import Path


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


def mysql_command(database: str | None = None) -> tuple[list[str], dict[str, str]]:
    host = os.getenv("MYSQL_HOST", "127.0.0.1")
    port = os.getenv("MYSQL_PORT", "3306")
    user = os.getenv("MYSQL_USER")
    password = os.getenv("MYSQL_PASSWORD")
    if not user or not password:
        raise SystemExit("MYSQL_USER and MYSQL_PASSWORD are required. Put them in your local environment, not source code.")
    args = ["mysql", f"-h{host}", f"-P{port}", f"-u{user}"]
    if database:
        args.append(database)
    env = {**os.environ, "MYSQL_PWD": password}
    return args, env


def apply_sql(path: Path) -> None:
    print(f"Applying {path.relative_to(ROOT)}")
    command, env = mysql_command()
    with path.open("rb") as sql_file:
        subprocess.run(command, stdin=sql_file, check=True, env=env)


def main() -> None:
    for file_name in MYSQL_MIGRATION_FILES:
        apply_sql(MIGRATIONS / file_name)
    for seed_name in ("staff_roles.sql", "property_seed.sql", "masterplan_seed.sql"):
        seed_path = SEEDS / seed_name
        if seed_path.exists():
            apply_sql(seed_path)
    print("Migrations and safe seed data applied.")


if __name__ == "__main__":
    main()
