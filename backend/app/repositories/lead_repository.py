from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from typing import Any

from app.schemas.enquiry_schemas import CampaignAttribution, EnquiryCreate, LeadActivity, LeadDetail, LeadSummary


class InMemoryLeadStore:
    def __init__(self) -> None:
        self.leads: dict[int, dict[str, Any]] = {}
        self.enquiries: list[dict[str, Any]] = []
        self.activities: list[dict[str, Any]] = []
        self.lead_sequence = 0
        self.reference_sequence = 0

    def reset(self) -> None:
        self.leads.clear()
        self.enquiries.clear()
        self.activities.clear()
        self.lead_sequence = 0
        self.reference_sequence = 0


store = InMemoryLeadStore()


class LeadRepository:
    def __init__(self, pool: Any | None = None, memory_store: InMemoryLeadStore = store) -> None:
        self.pool = pool
        self.store = memory_store

    async def next_reference_sequence(self) -> int:
        if self.pool:
            return await self.pool.insert_and_get_id("INSERT INTO enquiry_reference_sequence () VALUES ()")
        self.store.reference_sequence += 1
        return self.store.reference_sequence

    async def find_or_create_lead(self, payload: EnquiryCreate) -> dict[str, Any]:
        if self.pool:
            return await self._find_or_create_lead_db(payload)

        now = datetime.now(timezone.utc)
        email = str(payload.email).lower() if payload.email else None
        phone = payload.phone
        for lead in self.store.leads.values():
            if email and lead.get("email") == email:
                return lead
            if phone and lead.get("phone") == phone:
                return lead

        self.store.lead_sequence += 1
        lead = {
            "id": self.store.lead_sequence,
            "name": payload.name,
            "email": email,
            "phone": phone,
            "score": 0,
            "follow_up_status": "new",
            "property_interests": [],
            "collection_interests": [],
            "created_at": now,
            "last_activity_at": now,
        }
        self.store.leads[lead["id"]] = lead
        return lead

    async def save_enquiry_activity(
        self,
        *,
        lead: dict[str, Any],
        payload: EnquiryCreate,
        reference_number: str,
        score: int,
        follow_up_status: str,
        campaign: CampaignAttribution,
        notification_status: str,
    ) -> dict[str, Any]:
        if self.pool:
            return await self._save_enquiry_activity_db(
                lead=lead,
                payload=payload,
                reference_number=reference_number,
                score=score,
                follow_up_status=follow_up_status,
                campaign=campaign,
                notification_status=notification_status,
            )

        now = datetime.now(timezone.utc)
        lead["score"] = max(lead["score"], score)
        lead["follow_up_status"] = follow_up_status
        lead["last_activity_at"] = now
        if payload.property_slug and payload.property_slug not in lead["property_interests"]:
            lead["property_interests"].append(payload.property_slug)
        if payload.collection_slug and payload.collection_slug not in lead["collection_interests"]:
            lead["collection_interests"].append(payload.collection_slug)

        enquiry = {
            "reference_number": reference_number,
            "lead_id": lead["id"],
            "enquiry_type": payload.enquiry_type.value,
            "payload": payload.model_dump(mode="json"),
            "score": score,
            "follow_up_status": follow_up_status,
            "notification_status": notification_status,
            "created_at": now,
        }
        self.store.enquiries.append(enquiry)

        activity = {
            "lead_id": lead["id"],
            "reference_number": reference_number,
            "activity_type": payload.enquiry_type.value,
            "summary": self._activity_summary(payload),
            "created_at": now,
            "campaign": campaign,
        }
        self.store.activities.append(activity)
        return enquiry

    async def list_leads(self) -> list[LeadSummary]:
        if self.pool:
            rows = await self.pool.fetch(
                """
                SELECT id, name, email, phone, score, follow_up_status, last_activity_at, created_at
                FROM leads
                ORDER BY last_activity_at DESC
                """
            )
            return [LeadSummary(**dict(row)) for row in rows]

        leads = sorted(self.store.leads.values(), key=lambda item: item["last_activity_at"], reverse=True)
        return [LeadSummary(**deepcopy(lead)) for lead in leads]

    async def get_lead(self, lead_id: int) -> LeadDetail | None:
        if self.pool:
            row = await self.pool.fetchrow(
                """
                SELECT id, name, email, phone, score, follow_up_status, property_interests,
                       collection_interests, last_activity_at, created_at
                FROM leads
                WHERE id = %s
                """,
                lead_id,
            )
            if not row:
                return None
            activities = await self.pool.fetch(
                """
                SELECT reference_number, activity_type, summary, created_at, campaign
                FROM lead_activities
                WHERE lead_id = %s
                ORDER BY created_at DESC
                """,
                lead_id,
            )
            data = dict(row)
            data["activities"] = [LeadActivity(**dict(activity)) for activity in activities]
            return LeadDetail(**data)

        lead = self.store.leads.get(lead_id)
        if not lead:
            return None
        activities = [
            LeadActivity(
                reference_number=item["reference_number"],
                activity_type=item["activity_type"],
                summary=item["summary"],
                created_at=item["created_at"],
                campaign=item["campaign"],
            )
            for item in self.store.activities
            if item["lead_id"] == lead_id
        ]
        data = deepcopy(lead)
        data["activities"] = sorted(activities, key=lambda item: item.created_at, reverse=True)
        return LeadDetail(**data)

    async def _find_or_create_lead_db(self, payload: EnquiryCreate) -> dict[str, Any]:
        raise NotImplementedError("MySQL lead persistence needs project schema migrations first")

    async def _save_enquiry_activity_db(self, **kwargs) -> dict[str, Any]:
        raise NotImplementedError("MySQL enquiry persistence needs project schema migrations first")

    def _activity_summary(self, payload: EnquiryCreate) -> str:
        interest = payload.property_slug or payload.collection_slug or "general ONIRIA City"
        return f"{payload.enquiry_type.value.replace('_', ' ').title()} enquiry for {interest}"
