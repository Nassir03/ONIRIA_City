import re

from fastapi import HTTPException, status

_UNSAFE_PATTERN = re.compile(r"(<script|</script|javascript:|onerror=|onload=)", re.IGNORECASE)


def reject_unsafe_text(value: str | None, field_name: str = "value") -> str | None:
    if value is None:
        return None
    if _UNSAFE_PATTERN.search(value):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"{field_name} contains unsafe content",
        )
    return value.strip()


def normalize_slug(value: str) -> str:
    slug = value.strip().lower()
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid slug")
    return slug
