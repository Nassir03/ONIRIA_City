from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_returns_consistent_structure():
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["status"] == "ok"
    assert "database" in body["data"]


def test_list_properties_returns_seeded_public_properties():
    response = client.get("/api/properties")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["total"] >= 3
    assert body["data"]["items"][0]["status"] == "published"


def test_get_property_by_slug():
    response = client.get("/api/properties/skyline-villa")
    assert response.status_code == 200
    body = response.json()
    assert body["data"]["slug"] == "skyline-villa"
    assert body["data"]["media"]


def test_collections_endpoint():
    response = client.get("/api/collections")
    assert response.status_code == 200
    titles = {item["title"] for item in response.json()["data"]}
    assert {"Villa Collection", "Residence Collection", "V Avenue"} <= titles


def test_masterplan_zones_endpoint():
    response = client.get("/api/masterplan/zones")
    assert response.status_code == 200
    assert len(response.json()["data"]) >= 3


def test_search_endpoint():
    response = client.get("/api/search", params={"q": "villa"})
    assert response.status_code == 200
    assert any(item["type"] == "property" for item in response.json()["data"])
