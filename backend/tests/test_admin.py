from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_admin_session_requires_database_or_staff_cookie():
    response = client.get("/api/admin/session")
    assert response.status_code in {401, 503}


def test_admin_dashboard_is_protected():
    response = client.get("/api/admin/dashboard")
    assert response.status_code in {401, 503}
