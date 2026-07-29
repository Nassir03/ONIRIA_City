# ONIRIA City

Full-stack ONIRIA City website with a FastAPI backend, MySQL database, public enquiry workflow, lead management APIs, and a private staff dashboard.

## Run With Docker

Start Docker Desktop, then run from the project root:

```powershell
docker compose up -d --build
```

Docker starts:

- Frontend: `http://127.0.0.1:3000`
- Backend API: `http://127.0.0.1:7000/api`
- API docs: `http://127.0.0.1:7000/docs`
- MySQL on host port `3307`

The `migrate` service applies the MySQL migrations and safe seed data before the backend starts.

## Create An Admin User

Create your first staff administrator locally. Do not commit or share the password.

```powershell
$env:MYSQL_HOST="127.0.0.1"
$env:MYSQL_PORT="3307"
$env:MYSQL_DATABASE="oniria_city"
$env:MYSQL_USER="oniria_user"
$env:MYSQL_PASSWORD="oniria_password"
backend\.venv\Scripts\python.exe backend\scripts\create_admin.py
```

Then open `http://127.0.0.1:3000/admin/login`.

## Test The Project

Run backend tests:

```powershell
backend\.venv\Scripts\python.exe -m pytest backend\tests
```

Run frontend checks:

```powershell
npm.cmd run lint
npm.cmd run build
```

Check Docker status:

```powershell
docker compose ps
```

Check backend health:

```powershell
curl.exe -s http://127.0.0.1:7000/api/health
```

## Test Enquiries With Different Values

Change `enquiry_type`, contact details, `budget`, `collection_slug`, and `campaign` values to confirm different scores and follow-up statuses.

```powershell
$body = @{
  enquiry_type = "site_visit"
  name = "Test Visitor"
  email = "visitor@example.com"
  phone = "+255700000000"
  message = "I want to visit ONIRIA City."
  preferred_date = "2026-08-10"
  number_of_guests = 2
  anonymous_session_id = "anon-local-test"
  consent = $true
  campaign = @{
    utm_source = "google"
    utm_medium = "cpc"
    utm_campaign = "local-test"
    landing_page = "/inquiries"
  }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:7000/api/site-visits" `
  -ContentType "application/json" `
  -Body $body
```

Useful endpoints to try:

- `POST /api/enquiries`
- `POST /api/brochure-requests`
- `POST /api/consultations`
- `POST /api/site-visits`
- `POST /api/commercial-enquiries`
- `GET /api/internal/leads`
- `GET /api/internal/leads/{lead_id}`
