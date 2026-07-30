from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_cors_allows_local_frontend_origin_for_public_form_preflight():
    response = client.options(
        "/api/enquiries",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert response.headers["access-control-allow-credentials"] == "true"


def test_cors_allows_loopback_frontend_origin_for_public_form_preflight():
    response = client.options(
        "/api/enquiries",
        headers={
            "Origin": "http://127.0.0.1:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:3000"
    assert response.headers["access-control-allow-credentials"] == "true"


def test_cors_allows_local_frontend_origin_for_admin_preflight():
    response = client.options(
        "/api/admin/session",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert response.headers["access-control-allow-credentials"] == "true"


def test_cors_does_not_grant_unknown_origin():
    response = client.options(
        "/api/enquiries",
        headers={
            "Origin": "http://malicious.example",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )

    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers


def test_readiness_endpoint_is_safe():
    response = client.get("/api/ready")

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "data" in body
    assert "password" not in response.text.lower()
