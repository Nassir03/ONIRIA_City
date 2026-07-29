from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_ai_chat_uses_approved_public_knowledge():
    response = client.post(
        "/api/ai/chat",
        json={"question": "What properties are available?", "anonymous_session_id": "session-ai-123"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["data"]["source_document_ids"]
    assert body["data"]["escalated"] is False


def test_ai_chat_escalates_price_questions():
    response = client.post(
        "/api/ai/chat",
        json={"question": "What is the price and payment plan?", "anonymous_session_id": "session-ai-123"},
    )
    assert response.status_code == 200
    body = response.json()["data"]
    assert body["escalated"] is True
    assert body["source_document_ids"] == []


def test_whatsapp_verify_webhook():
    response = client.get(
        "/api/webhooks/whatsapp",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "oniria-demo-verify-token",
            "hub.challenge": "12345",
        },
    )
    assert response.status_code == 200
    assert response.json() == 12345


def test_whatsapp_process_webhook_demo_mode():
    response = client.post(
        "/api/webhooks/whatsapp",
        json={
            "object": "whatsapp_business_account",
            "entry": [{"changes": [{"value": {"messages": [{"id": "wamid.1"}]}}]}],
        },
    )
    assert response.status_code == 200
    assert response.json()["data"]["processed_messages"] == 1
