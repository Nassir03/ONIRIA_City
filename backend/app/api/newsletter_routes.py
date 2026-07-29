from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.api.admin_dependencies import require_database, require_permission
from app.repositories.newsletter_repository import NewsletterRepository
from app.schemas.newsletter_schemas import NewsletterSubscribeRequest, NewsletterUnsubscribeRequest, SubscriberListFilters
from app.services.newsletter_service import NewsletterService
from app.utils.rate_limit import FixedWindowRateLimiter

router = APIRouter(prefix="/newsletter", tags=["newsletter"])
admin_router = APIRouter(prefix="/admin/newsletter", tags=["admin newsletter"])
subscribe_limiter = FixedWindowRateLimiter(max_attempts=5, window_seconds=60 * 60)


@router.post("/subscribe")
async def subscribe(payload: NewsletterSubscribeRequest, request: Request, database=Depends(require_database)):
    ip = request.client.host if request.client else "unknown"
    if not subscribe_limiter.allow(f"{ip}:{str(payload.email).lower()}"):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests. Please try again later.")
    result = await NewsletterService(database).subscribe(payload)
    return {"success": True, "data": result}


@router.post("/unsubscribe")
async def unsubscribe(payload: NewsletterUnsubscribeRequest, database=Depends(require_database)):
    result = await NewsletterService(database).unsubscribe(str(payload.email))
    return {"success": True, "data": result}


@admin_router.get("/subscribers")
async def subscribers(
    q: str | None = None,
    status: str | None = None,
    campaign: str | None = None,
    page: int = 1,
    page_size: int = 25,
    database=Depends(require_database),
    staff=Depends(require_permission("newsletter:manage")),
):
    filters = SubscriberListFilters(q=q, status=status, campaign=campaign, page=page, page_size=page_size)
    return {"success": True, "data": await NewsletterRepository(database).list_subscribers(filters.model_dump(exclude_none=True))}
