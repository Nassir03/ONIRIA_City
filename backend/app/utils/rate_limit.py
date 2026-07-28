import time
from collections import defaultdict, deque
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int, protected_prefixes: tuple[str, ...]) -> None:
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.protected_prefixes = protected_prefixes
        self._requests: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        if not request.url.path.startswith(self.protected_prefixes):
            return await call_next(request)

        client_host = request.client.host if request.client else "unknown"
        key = f"{client_host}:{request.url.path}"
        now = time.monotonic()
        window_start = now - 60
        bucket = self._requests[key]

        while bucket and bucket[0] < window_start:
            bucket.popleft()

        if len(bucket) >= self.requests_per_minute:
            return Response(
                content='{"success":false,"error":{"code":"rate_limited","message":"Too many requests. Please try again later."}}',
                media_type="application/json",
                status_code=429,
            )

        bucket.append(now)
        return await call_next(request)
