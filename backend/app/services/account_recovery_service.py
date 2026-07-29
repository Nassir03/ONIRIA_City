from __future__ import annotations

from typing import Any

from app.repositories.account_recovery_repository import AccountRecoveryRepository
from app.schemas.account_recovery_schemas import RecoveryRequestCreate
from app.utils.reference_number import make_account_recovery_reference


RECOVERY_CONFIRMATION = "Your staff account-recovery request has been recorded."


class AccountRecoveryService:
    def __init__(self, pool: Any) -> None:
        self.repo = AccountRecoveryRepository(pool)

    async def create_request(self, payload: RecoveryRequestCreate) -> dict[str, str]:
        sequence = await self.repo.next_reference_sequence()
        reference = make_account_recovery_reference(sequence)
        values = payload.model_dump()
        values["known_email"] = str(payload.known_email).lower() if payload.known_email else None
        values["reference_number"] = reference
        row = await self.repo.create(values)
        await self.repo.audit(None, "STAFF_ACCOUNT_RECOVERY_REQUEST_CREATED", int(row["id"]), None, {"reference_number": reference})
        return {
            "reference_number": reference,
            "message": f"{RECOVERY_CONFIRMATION}\n\nReference: {reference}\n\nAn authorised ONIRIA administrator will review your request.",
        }
