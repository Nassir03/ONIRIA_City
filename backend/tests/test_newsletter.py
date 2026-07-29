from __future__ import annotations

import asyncio

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.newsletter_schemas import NewsletterSubscribeRequest
from app.services.newsletter_service import NEWSLETTER_ALREADY_SUBSCRIBED_MESSAGE, NEWSLETTER_SUBSCRIBED_MESSAGE, NewsletterService


client = TestClient(app)


class FakeNewsletterPool:
    def __init__(self) -> None:
        self.rows = []
        self.next_id = 1

    async def fetchrow(self, query, *params):
        if "WHERE email" in query:
            email = params[0]
            for row in self.rows:
                if row["email"] == email:
                    return dict(row)
            return None
        if "WHERE id" in query:
            row_id = params[0]
            for row in self.rows:
                if row["id"] == row_id:
                    return dict(row)
            return None
        return None

    async def insert_and_get_id(self, query, *params):
        row = {
            "id": self.next_id,
            "email": params[0],
            "status": "active",
            "source_page": params[1],
            "anonymous_session_id": params[2],
            "utm_source": params[3],
            "utm_medium": params[4],
            "utm_campaign": params[5],
            "utm_content": params[6],
            "consent": 1,
            "subscribed_at": "now",
        }
        self.rows.append(row)
        self.next_id += 1
        return row["id"]

    async def execute(self, query, *params):
        return 1

    async def fetch(self, query, *params):
        return list(self.rows)

    async def fetchval(self, query, *params):
        return len(self.rows)


def test_newsletter_valid_email_succeeds_and_saves_attribution():
    async def run():
        pool = FakeNewsletterPool()
        payload = NewsletterSubscribeRequest(
            email="Visitor@Example.com",
            consent=True,
            source_page="/",
            anonymous_session_id="anon-123",
            utm_source="instagram",
            utm_medium="social",
            utm_campaign="villa_launch",
            utm_content="footer",
        )

        result = await NewsletterService(pool).subscribe(payload)

        assert result["message"] == NEWSLETTER_SUBSCRIBED_MESSAGE
        assert len(pool.rows) == 1
        assert pool.rows[0]["email"] == "visitor@example.com"
        assert pool.rows[0]["utm_campaign"] == "villa_launch"

    asyncio.run(run())


def test_newsletter_duplicate_email_is_graceful_and_does_not_duplicate():
    async def run():
        pool = FakeNewsletterPool()
        payload = NewsletterSubscribeRequest(email="visitor@example.com", consent=True, source_page="/")

        first = await NewsletterService(pool).subscribe(payload)
        second = await NewsletterService(pool).subscribe(payload)

        assert first["message"] == NEWSLETTER_SUBSCRIBED_MESSAGE
        assert second["message"] == NEWSLETTER_ALREADY_SUBSCRIBED_MESSAGE
        assert len(pool.rows) == 1

    asyncio.run(run())


def test_newsletter_invalid_email_and_missing_consent_fail():
    with pytest.raises(ValueError):
        NewsletterSubscribeRequest(email="not-an-email", consent=True)
    with pytest.raises(ValueError):
        NewsletterSubscribeRequest(email="visitor@example.com", consent=False)


def test_public_users_cannot_list_subscribers():
    response = client.get("/api/admin/newsletter/subscribers")
    assert response.status_code in {401, 503}
