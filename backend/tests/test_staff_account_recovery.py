from __future__ import annotations

import asyncio
from urllib.parse import parse_qs, urlparse

import pytest

from app.config import Settings
from app.schemas.account_recovery_schemas import RecoveryRequestCreate
from app.security.password_hashing import hash_password, verify_password
from app.services.account_recovery_service import AccountRecoveryService
from app.services.password_reset_service import NEUTRAL_FORGOT_PASSWORD_MESSAGE, PasswordResetService


class FakeEmailService:
    def __init__(self) -> None:
        self.messages = []

    async def send_staff_password_reset(self, *, recipient: str, reset_url: str, expires_minutes: int):
        self.messages.append({"recipient": recipient, "reset_url": reset_url, "expires_minutes": expires_minutes})


class FakePool:
    def __init__(self) -> None:
        self.staff = {
            1: {
                "id": 1,
                "full_name": "Admin User",
                "email": "admin@oniriacity.com",
                "password_hash": hash_password("CurrentPass12!"),
                "is_active": 1,
            },
            2: {
                "id": 2,
                "full_name": "Disabled User",
                "email": "disabled@oniriacity.com",
                "password_hash": hash_password("CurrentPass12!"),
                "is_active": 0,
            },
        }
        self.roles = {1: ["administrator"], 2: ["sales_agent"]}
        self.reset_tokens = []
        self.sessions = [{"staff_user_id": 1, "revoked_at": None}, {"staff_user_id": 1, "revoked_at": None}]
        self.recovery_requests = []
        self.audit_logs = []
        self.next_id = 1

    async def fetchrow(self, query, *params):
        if "FROM staff_users WHERE email" in query:
            email = params[0]
            for staff in self.staff.values():
                if staff["email"] == email:
                    return dict(staff)
            return None
        if "FROM staff_password_reset_tokens" in query:
            token_hash = params[0]
            for token in self.reset_tokens:
                staff = self.staff[token["staff_user_id"]]
                if token["token_hash"] == token_hash and not token.get("used_at") and not token.get("revoked_at") and staff["is_active"]:
                    return {**token, "email": staff["email"], "password_hash": staff["password_hash"], "is_active": staff["is_active"]}
            return None
        if "FROM staff_account_recovery_requests" in query and "WHERE arr.id" in query:
            request_id = params[0]
            for item in self.recovery_requests:
                if item["id"] == request_id:
                    return dict(item)
            return None
        return None

    async def fetch(self, query, *params):
        if "FROM staff_user_roles" in query:
            return [{"role_key": role} for role in self.roles.get(params[0], [])]
        if "FROM staff_account_recovery_requests" in query and "ORDER BY arr.created_at" in query:
            return [dict(item) for item in self.recovery_requests]
        if "FROM staff_users su" in query:
            return [{"id": 1, "full_name": "Admin User", "email": "admin@oniriacity.com", "is_active": 1, "roles": "administrator"}]
        return []

    async def fetchval(self, query, *params):
        if "COUNT(*) + 1" in query:
            return len(self.recovery_requests) + 1
        return 0

    async def insert_and_get_id(self, query, *params):
        new_id = self.next_id
        self.next_id += 1
        if "staff_password_reset_tokens" in query:
            self.reset_tokens.append({
                "id": new_id,
                "staff_user_id": params[0],
                "token_hash": params[1],
                "expires_at": params[2],
                "requested_ip": params[3],
                "requested_user_agent": params[4],
                "used_at": None,
                "revoked_at": None,
            })
        if "staff_account_recovery_requests" in query:
            self.recovery_requests.append({
                "id": new_id,
                "reference_number": params[0],
                "full_name": params[1],
                "known_email": params[2],
                "phone": params[3],
                "staff_identifier": params[4],
                "department": params[5],
                "claimed_role": params[6],
                "recovery_reason": params[7],
                "preferred_contact_method": params[8],
                "message": params[9],
                "status": "pending",
                "assigned_admin_id": None,
            })
        return new_id

    async def execute(self, query, *params):
        if "UPDATE staff_password_reset_tokens" in query and "revoked_at" in query:
            staff_id = params[0]
            count = 0
            for token in self.reset_tokens:
                if token["staff_user_id"] == staff_id and not token.get("used_at") and not token.get("revoked_at"):
                    token["revoked_at"] = "now"
                    count += 1
            return count
        if "UPDATE staff_users SET password_hash" in query:
            self.staff[params[1]]["password_hash"] = params[0]
            return 1
        if "UPDATE staff_sessions SET revoked_at" in query:
            count = 0
            for session in self.sessions:
                if session["staff_user_id"] == params[0] and session["revoked_at"] is None:
                    session["revoked_at"] = "now"
                    count += 1
            return count
        if "UPDATE staff_password_reset_tokens SET used_at" in query:
            for token in self.reset_tokens:
                if token["id"] == params[0]:
                    token["used_at"] = "now"
            return 1
        if "INSERT INTO audit_logs" in query:
            self.audit_logs.append({"action": params[1], "entity_id": params[2]})
            return 1
        return 1


def test_forgot_password_known_and_unknown_receive_same_public_response():
    async def run():
        pool = FakePool()
        email_service = FakeEmailService()
        service = PasswordResetService(pool, Settings(), email_service)

        known = await service.request_reset(email="admin@oniriacity.com", requested_ip="127.0.0.1", requested_user_agent="test")
        unknown = await service.request_reset(email="unknown@oniriacity.com", requested_ip="127.0.0.1", requested_user_agent="test")

        assert known["message"] == NEUTRAL_FORGOT_PASSWORD_MESSAGE
        assert unknown["message"] == NEUTRAL_FORGOT_PASSWORD_MESSAGE
        assert len(email_service.messages) == 1

    asyncio.run(run())


def test_reset_token_hash_is_stored_and_valid_token_resets_password_and_revokes_sessions():
    async def run():
        pool = FakePool()
        email_service = FakeEmailService()
        service = PasswordResetService(pool, Settings(), email_service)

        await service.request_reset(email="admin@oniriacity.com", requested_ip="127.0.0.1", requested_user_agent="test")
        token = parse_qs(urlparse(email_service.messages[0]["reset_url"]).query)["token"][0]

        assert pool.reset_tokens[0]["token_hash"] != token
        assert await service.validate_token(token) is True

        await service.reset_password(
            token=token,
            new_password="NewPassword12!",
            confirm_password="NewPassword12!",
            ip="127.0.0.1",
            user_agent="test",
        )

        assert verify_password("NewPassword12!", pool.staff[1]["password_hash"])
        assert all(session["revoked_at"] for session in pool.sessions)
        assert pool.reset_tokens[0]["used_at"]
        assert await service.validate_token(token) is False
        assert {entry["action"] for entry in pool.audit_logs} >= {"PASSWORD_RESET_COMPLETED", "SESSION_REVOKED_AFTER_PASSWORD_RESET"}

    asyncio.run(run())


def test_disabled_account_does_not_receive_usable_reset_token():
    async def run():
        pool = FakePool()
        email_service = FakeEmailService()
        service = PasswordResetService(pool, Settings(), email_service)

        await service.request_reset(email="disabled@oniriacity.com", requested_ip="127.0.0.1", requested_user_agent="test")

        assert email_service.messages == []
        assert pool.reset_tokens == []

    asyncio.run(run())


def test_weak_or_mismatched_reset_password_fails():
    async def run():
        pool = FakePool()
        email_service = FakeEmailService()
        service = PasswordResetService(pool, Settings(), email_service)
        await service.request_reset(email="admin@oniriacity.com", requested_ip="127.0.0.1", requested_user_agent="test")
        token = parse_qs(urlparse(email_service.messages[0]["reset_url"]).query)["token"][0]

        with pytest.raises(ValueError):
            await service.reset_password(token=token, new_password="weak", confirm_password="weak", ip=None, user_agent=None)
        with pytest.raises(ValueError):
            await service.reset_password(token=token, new_password="NewPassword12!", confirm_password="OtherPassword12!", ip=None, user_agent=None)
        with pytest.raises(ValueError):
            await service.reset_password(token=token, new_password="CurrentPass12!", confirm_password="CurrentPass12!", ip=None, user_agent=None)

    asyncio.run(run())


def test_recovery_request_is_saved_with_reference_and_no_account_disclosure():
    async def run():
        pool = FakePool()
        payload = RecoveryRequestCreate(
            full_name="Admin User",
            known_email=None,
            phone="+255700000000",
            staff_identifier="STAFF-1",
            department="Sales",
            claimed_role="administrator",
            recovery_reason="forgot_staff_email",
            preferred_contact_method="phone",
            message="Please help.",
        )

        result = await AccountRecoveryService(pool).create_request(payload)

        assert result["reference_number"].startswith("AR-")
        assert "authorised ONIRIA administrator" in result["message"]
        assert pool.recovery_requests[0]["known_email"] is None
        assert pool.audit_logs[0]["action"] == "STAFF_ACCOUNT_RECOVERY_REQUEST_CREATED"

    asyncio.run(run())
