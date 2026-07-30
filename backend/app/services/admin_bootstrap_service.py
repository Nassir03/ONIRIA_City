from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any

from app.config import Settings
from app.security.password_hashing import hash_password, validate_password_strength

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
ADMIN_ROLE_KEY = "administrator"


@dataclass
class AdminBootstrapResult:
    status: str
    email: str | None = None
    active: bool = False
    has_administrator_role: bool = False


def validate_admin_email(email: str | None) -> str:
    normalized = (email or "").strip().lower()
    if not normalized or not EMAIL_PATTERN.fullmatch(normalized):
        raise ValueError("Required values are missing: ONIRIA_ADMIN_EMAIL must be a valid email address.")
    return normalized


def validate_admin_password(password: str | None, confirm: str | None) -> str:
    if not password or not confirm:
        raise ValueError("Required values are missing: ONIRIA_ADMIN_PASSWORD and ONIRIA_ADMIN_PASSWORD_CONFIRM.")
    if password != confirm:
        raise ValueError("ONIRIA_ADMIN_PASSWORD and ONIRIA_ADMIN_PASSWORD_CONFIRM do not match.")
    validate_password_strength(password)
    return password


async def bootstrap_administrator(connection: Any, settings: Settings) -> AdminBootstrapResult:
    email = validate_admin_email(settings.oniria_admin_email)
    full_name = (settings.oniria_admin_full_name or "ONIRIA Administrator").strip()
    password = validate_admin_password(settings.oniria_admin_password, settings.oniria_admin_password_confirm)

    async with connection.cursor() as cursor:
        await cursor.execute("SELECT id FROM staff_roles WHERE role_key = %s", (ADMIN_ROLE_KEY,))
        role = await cursor.fetchone()
        if not role:
            raise ValueError("administrator role is missing. Run migrations and staff_roles.sql first.")
        role_id = int(role[0])

    async with connection.cursor() as cursor:
        await cursor.execute("SELECT id, is_active FROM staff_users WHERE LOWER(email) = LOWER(%s) LIMIT 1", (email,))
        staff = await cursor.fetchone()

        if staff:
            staff_id = int(staff[0])
            is_active = bool(staff[1])
            await cursor.execute(
                """
                SELECT 1
                FROM staff_user_roles
                WHERE staff_user_id = %s AND role_id = %s
                LIMIT 1
                """,
                (staff_id, role_id),
            )
            has_role = await cursor.fetchone() is not None
            role_added = False
            if not has_role:
                await cursor.execute(
                    "INSERT INTO staff_user_roles (staff_user_id, role_id) VALUES (%s, %s)",
                    (staff_id, role_id),
                )
                has_role = True
                role_added = True
            if settings.oniria_admin_update_password:
                await cursor.execute(
                    "UPDATE staff_users SET password_hash = %s WHERE id = %s",
                    (hash_password(password), staff_id),
                )
            if not is_active:
                return AdminBootstrapResult(status="Administrator is inactive", email=email, active=False, has_administrator_role=has_role)
            if role_added:
                return AdminBootstrapResult(status="Administrator role added", email=email, active=True, has_administrator_role=True)
            return AdminBootstrapResult(status="Administrator already exists", email=email, active=True, has_administrator_role=True)

        await cursor.execute(
            "INSERT INTO staff_users (full_name, email, password_hash, is_active) VALUES (%s, %s, %s, 1)",
            (full_name, email, hash_password(password)),
        )
        staff_id = int(cursor.lastrowid)
        await cursor.execute(
            "INSERT INTO staff_user_roles (staff_user_id, role_id) VALUES (%s, %s)",
            (staff_id, role_id),
        )
        return AdminBootstrapResult(status="Administrator created", email=email, active=True, has_administrator_role=True)


async def verify_administrator(connection: Any, email: str) -> AdminBootstrapResult:
    normalized = validate_admin_email(email)
    async with connection.cursor() as cursor:
        await cursor.execute(
            """
            SELECT su.id, su.is_active,
                   EXISTS (
                       SELECT 1
                       FROM staff_user_roles sur
                       JOIN staff_roles sr ON sr.id = sur.role_id
                       WHERE sur.staff_user_id = su.id AND sr.role_key = %s
                   ) AS has_administrator_role
            FROM staff_users su
            WHERE LOWER(su.email) = LOWER(%s)
            LIMIT 1
            """,
            (ADMIN_ROLE_KEY, normalized),
        )
        staff = await cursor.fetchone()
    if not staff:
        return AdminBootstrapResult(status="Administrator missing", email=normalized, active=False, has_administrator_role=False)
    return AdminBootstrapResult(
        status="Administrator verified",
        email=normalized,
        active=bool(staff[1]),
        has_administrator_role=bool(staff[2]),
    )
