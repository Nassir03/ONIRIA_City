from fastapi.testclient import TestClient
import pytest

from app.api.admin_dependencies import require_database
from app.main import app
from app.schemas.admin_auth_schemas import StaffCreateRequest
from app.security.password_hashing import hash_password, validate_password_strength
from app.config import get_settings


client = TestClient(app)


class FakeAdminDatabase:
    def __init__(self) -> None:
        self.password = "StrongPass12!"
        self.staff = {
            "id": 7,
            "full_name": "Test Admin",
            "email": "admin@example.com",
            "password_hash": hash_password(self.password),
            "is_active": 1,
        }
        self.roles = ["administrator"]
        self.sessions = {}

    async def fetchval(self, query, *params):
        return 0

    async def fetchrow(self, query, *params):
        if "FROM staff_users WHERE email" in query:
            return dict(self.staff)
        if "FROM staff_sessions" in query:
            token_hash = params[0]
            session = self.sessions.get(token_hash)
            if not session:
                return None
            return {
                "session_id": session["id"],
                "expires_at": session["expires_at"],
                "id": self.staff["id"],
                "full_name": self.staff["full_name"],
                "email": self.staff["email"],
                "is_active": self.staff["is_active"],
            }
        return None

    async def fetch(self, query, *params):
        if "FROM staff_user_roles" in query:
            return [{"role_key": role} for role in self.roles]
        return []

    async def insert_and_get_id(self, query, *params):
        staff_user_id, token_hash, expires_at = params
        self.sessions[token_hash] = {"id": 1, "staff_user_id": staff_user_id, "expires_at": expires_at}
        return 1

    async def execute(self, query, *params):
        return 1


@pytest.fixture
def fake_admin_database(monkeypatch):
    get_settings.cache_clear()
    monkeypatch.setenv("SESSION_COOKIE_SECURE", "false")
    monkeypatch.setenv("SESSION_COOKIE_SAMESITE", "lax")
    monkeypatch.delenv("SESSION_COOKIE_DOMAIN", raising=False)
    database = FakeAdminDatabase()
    app.dependency_overrides[require_database] = lambda: database
    try:
        yield database
    finally:
        app.dependency_overrides.pop(require_database, None)
        get_settings.cache_clear()


def test_admin_session_requires_database_or_staff_cookie():
    response = client.get("/api/admin/session")
    assert response.status_code in {401, 503}


def test_admin_dashboard_is_protected():
    response = client.get("/api/admin/dashboard")
    assert response.status_code in {401, 503}


def test_admin_login_sets_local_lax_session_cookie(fake_admin_database):
    response = client.post(
        "/api/admin/login",
        json={"email": fake_admin_database.staff["email"], "password": fake_admin_database.password},
    )

    assert response.status_code == 200
    cookie_header = response.headers["set-cookie"]
    assert "oniria_staff_session=" in cookie_header
    assert "HttpOnly" in cookie_header
    assert "Max-Age=28800" in cookie_header
    assert "Path=/" in cookie_header
    assert "SameSite=lax" in cookie_header
    assert "Secure" not in cookie_header


def test_admin_session_and_dashboard_accept_session_cookie(fake_admin_database):
    login_response = client.post(
        "/api/admin/login",
        json={"email": fake_admin_database.staff["email"], "password": fake_admin_database.password},
    )
    assert login_response.status_code == 200

    session_response = client.get("/api/admin/session", cookies=login_response.cookies)
    dashboard_response = client.get("/api/admin/dashboard", cookies=login_response.cookies)

    assert session_response.status_code == 200
    assert session_response.json()["success"] is True
    assert dashboard_response.status_code == 200
    assert dashboard_response.json()["success"] is True


def test_staff_email_must_be_valid_email_with_at_symbol():
    with pytest.raises(ValueError):
        StaffCreateRequest(full_name="Admin User", email="admin.example.com", password="StrongPass12!", roles=["administrator"])


@pytest.mark.parametrize(
    "password",
    [
        "strongpass1!",
        "STRONGPASS1!",
        "StrongPass!",
        "StrongPass1",
        "Aa1!",
    ],
)
def test_admin_password_requires_capital_small_number_symbol_and_length(password):
    with pytest.raises(ValueError):
        validate_password_strength(password)


def test_admin_password_accepts_required_complexity():
    validate_password_strength("StrongPass12!")
