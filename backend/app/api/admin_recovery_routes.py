from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.api.admin_dependencies import require_database, require_permission
from app.repositories.account_recovery_repository import AccountRecoveryRepository
from app.schemas.account_recovery_schemas import RecoveryAssignRequest, RecoveryRequestUpdate, RecoveryResolveRequest

router = APIRouter(prefix="/admin/account-recovery-requests", tags=["admin account recovery"])


@router.get("")
async def list_requests(database=Depends(require_database), staff=Depends(require_permission("account_recovery:manage"))):
    return {"success": True, "data": await AccountRecoveryRepository(database).list()}


@router.get("/{request_id}")
async def get_request(request_id: int, database=Depends(require_database), staff=Depends(require_permission("account_recovery:manage"))):
    row = await AccountRecoveryRepository(database).get(request_id)
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recovery request not found")
    return {"success": True, "data": row}


@router.patch("/{request_id}")
async def update_request(
    request_id: int,
    payload: RecoveryRequestUpdate,
    request: Request,
    database=Depends(require_database),
    staff=Depends(require_permission("account_recovery:manage")),
):
    repo = AccountRecoveryRepository(database)
    before = await repo.get(request_id)
    if not before:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recovery request not found")
    row = await repo.update(request_id, payload.model_dump(exclude_none=True))
    await repo.audit(staff["id"], "STAFF_ACCOUNT_RECOVERY_REQUEST_UPDATED", request_id, before, row, request.client.host if request.client else None, request.headers.get("user-agent"))
    return {"success": True, "data": row}


@router.post("/{request_id}/assign")
async def assign_request(
    request_id: int,
    payload: RecoveryAssignRequest,
    request: Request,
    database=Depends(require_database),
    staff=Depends(require_permission("account_recovery:manage")),
):
    repo = AccountRecoveryRepository(database)
    before = await repo.get(request_id)
    if not before:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recovery request not found")
    row = await repo.assign(request_id, payload.admin_id or staff["id"])
    await repo.audit(staff["id"], "STAFF_ACCOUNT_RECOVERY_REQUEST_ASSIGNED", request_id, before, row, request.client.host if request.client else None, request.headers.get("user-agent"))
    return {"success": True, "data": row}


@router.post("/{request_id}/resolve")
async def resolve_request(
    request_id: int,
    payload: RecoveryResolveRequest,
    request: Request,
    database=Depends(require_database),
    staff=Depends(require_permission("account_recovery:manage")),
):
    repo = AccountRecoveryRepository(database)
    before = await repo.get(request_id)
    if not before:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recovery request not found")
    row = await repo.resolve(request_id, payload.resolution_note, "resolved")
    await repo.audit(staff["id"], "STAFF_ACCOUNT_RECOVERY_REQUEST_RESOLVED", request_id, before, row, request.client.host if request.client else None, request.headers.get("user-agent"))
    return {"success": True, "data": row}


@router.post("/{request_id}/reject")
async def reject_request(
    request_id: int,
    payload: RecoveryResolveRequest,
    request: Request,
    database=Depends(require_database),
    staff=Depends(require_permission("account_recovery:manage")),
):
    repo = AccountRecoveryRepository(database)
    before = await repo.get(request_id)
    if not before:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recovery request not found")
    row = await repo.resolve(request_id, payload.resolution_note, "rejected")
    await repo.audit(staff["id"], "STAFF_ACCOUNT_RECOVERY_REQUEST_REJECTED", request_id, before, row, request.client.host if request.client else None, request.headers.get("user-agent"))
    return {"success": True, "data": row}
