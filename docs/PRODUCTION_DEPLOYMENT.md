# Production Deployment

## Required Steps

1. Use MySQL 8.4.
2. Copy env examples and fill secrets in the deployment environment.
3. Run migrations before starting backend traffic.
4. Run admin bootstrap once during deployment.
5. Run `python backend\scripts\verify_admin.py` to confirm active administrator role assignment.
6. Start backend.
7. Start frontend with a browser-reachable `NEXT_PUBLIC_API_BASE_URL`.
8. Test staff login.
9. Submit an enquiry and verify it in MySQL, `/admin/enquiries`, and `/admin/leads`.
10. Configure and verify Resend sender identity.
11. Rotate secrets on a schedule and after staff changes.

## Cookie Settings

Same-site local or same-domain production:

```text
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=lax
SESSION_COOKIE_DOMAIN=
```

Cross-site HTTPS production:

```text
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAMESITE=none
SESSION_COOKIE_DOMAIN=
```

`SameSite=None` requires `Secure=true`.

## Docker

Create `.env` and `backend/.env`, then:

```powershell
docker compose up -d --build
```

Docker service order is:

1. `mysql`
2. `migrate`
3. `admin-bootstrap`
4. `backend`
5. `frontend`

Do not place production secrets in `NEXT_PUBLIC_*` variables.
