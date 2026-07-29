from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.schemas.admin_auth_schemas import StaffCreateRequest
from app.security.password_hashing import validate_password_strength


client = TestClient(app)


def test_admin_session_requires_database_or_staff_cookie():
    response = client.get("/api/admin/session")
    assert response.status_code in {401, 503}


def test_admin_dashboard_is_protected():
    response = client.get("/api/admin/dashboard")
    assert response.status_code in {401, 503}


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
