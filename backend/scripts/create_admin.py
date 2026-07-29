from __future__ import annotations

import asyncio
import getpass
import os
import re
import sys
from pathlib import Path

try:
    import aiomysql
except ModuleNotFoundError:
    raise SystemExit("aiomysql is not installed. Run: backend\\.venv\\Scripts\\python.exe -m pip install -r backend\\requirements.txt")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.security.password_hashing import hash_password, validate_password_strength

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


async def main() -> None:
    required = ["MYSQL_HOST", "MYSQL_DATABASE", "MYSQL_USER", "MYSQL_PASSWORD"]
    missing = [name for name in required if not os.getenv(name)]
    if missing:
        raise SystemExit(f"Missing required environment values: {', '.join(missing)}")

    full_name = os.getenv("ONIRIA_ADMIN_FULL_NAME") or input("Full name: ").strip()
    email = (os.getenv("ONIRIA_ADMIN_EMAIL") or input("Email: ")).strip().lower()
    if not EMAIL_PATTERN.fullmatch(email):
        raise SystemExit("Email must be a valid address and contain @.")
    password = os.getenv("ONIRIA_ADMIN_PASSWORD") or getpass.getpass("Password: ")
    confirm = os.getenv("ONIRIA_ADMIN_PASSWORD_CONFIRM") or (
        password if os.getenv("ONIRIA_ADMIN_PASSWORD") else getpass.getpass("Confirm password: ")
    )
    if password != confirm:
        raise SystemExit("Passwords do not match.")
    try:
        validate_password_strength(password)
    except ValueError as exc:
        raise SystemExit(str(exc)) from exc

    connection = await aiomysql.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        db=os.getenv("MYSQL_DATABASE"),
        autocommit=False,
    )
    try:
        async with connection.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute("SELECT id FROM staff_users WHERE email = %s", (email,))
            if await cursor.fetchone():
                raise SystemExit("A staff user with that email already exists.")
            await cursor.execute(
                "INSERT INTO staff_users (full_name, email, password_hash) VALUES (%s, %s, %s)",
                (full_name, email, hash_password(password)),
            )
            staff_id = cursor.lastrowid
            await cursor.execute("SELECT id FROM staff_roles WHERE role_key = 'administrator'")
            role = await cursor.fetchone()
            if not role:
                raise SystemExit("administrator role is missing. Run migrations and staff role seed first.")
            await cursor.execute(
                "INSERT INTO staff_user_roles (staff_user_id, role_id) VALUES (%s, %s)",
                (staff_id, role["id"]),
            )
        await connection.commit()
    except Exception:
        await connection.rollback()
        raise
    finally:
        connection.close()
    print(f"Administrator created for {email}.")


if __name__ == "__main__":
    asyncio.run(main())
