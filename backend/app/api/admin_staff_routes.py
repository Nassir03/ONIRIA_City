from fastapi import APIRouter, Depends, HTTPException, status

from app.api.admin_dependencies import require_database, require_permission
from app.repositories.staff_repository import StaffRepository
from app.repositories.password_reset_repository import PasswordResetRepository
from app.schemas.admin_auth_schemas import StaffCreateRequest, StaffUpdateRequest
from app.security.password_hashing import hash_password, validate_password_strength

router = APIRouter(prefix="/admin/staff", tags=["admin staff"])


@router.get("")
async def list_staff(database=Depends(require_database), staff=Depends(require_permission("staff:manage"))):
    return {"success": True, "data": await StaffRepository(database).list_staff()}


@router.post("")
async def create_staff(payload: StaffCreateRequest, database=Depends(require_database), staff=Depends(require_permission("staff:manage"))):
    try:
        validate_password_strength(payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    repo = StaffRepository(database)
    if await repo.get_staff_by_email(str(payload.email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Staff email already exists")
    created = await repo.create_staff(
        full_name=payload.full_name,
        email=str(payload.email),
        password_hash=hash_password(payload.password),
        roles=payload.roles,
    )
    return {"success": True, "data": created}


@router.patch("/{staff_id}")
async def update_staff(staff_id: int, payload: StaffUpdateRequest, database=Depends(require_database), staff=Depends(require_permission("staff:manage"))):
    result = await StaffRepository(database).update_staff(staff_id, payload.model_dump(exclude_none=True))
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff not found")
    return {"success": True, "data": result}


@router.post("/{staff_id}/disable")
async def disable_staff(staff_id: int, database=Depends(require_database), staff=Depends(require_permission("staff:manage"))):
    staff_repo = StaffRepository(database)
    result = await staff_repo.update_staff(staff_id, {"is_active": False})
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff not found")
    await staff_repo.revoke_staff_sessions(staff_id)
    await PasswordResetRepository(database).revoke_unused_for_staff(staff_id)
    return {"success": True, "data": result}
