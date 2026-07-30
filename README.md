# ONIRIA City

Full-stack ONIRIA City website with a Next.js frontend, FastAPI backend, MySQL 8.4 database, public enquiry workflow, lead management APIs, staff authentication, and a private admin dashboard.

## Environment Files

Copy examples before running locally:

```powershell
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env.local
```

Fill secrets manually. Never commit `.env`, `backend/.env`, `frontend/.env.local`, passwords, Resend API keys, or private email addresses.

Browser requests use `NEXT_PUBLIC_API_BASE_URL`. For local development:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:7000/api
```

Do not use container-only names such as `http://backend:7000` in a value used by an external browser.

## Local Startup

1. Start MySQL 8.4 and create/use the `oniria_city` database.
2. Fill `backend/.env` with either `DATABASE_URL` or `MYSQL_*` values.
3. Run migrations:

```powershell
python backend\scripts\run_migrations.py
```

4. Bootstrap the first admin:

```powershell
python backend\scripts\create_admin.py
```

Verify the configured admin without printing secrets:

```powershell
python backend\scripts\verify_admin.py
```

5. Start the backend:

```powershell
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 7000
```

6. Start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

7. Open `http://localhost:3000/admin/login` and test the configured admin.

## Docker Startup

Fill root `.env` and `backend/.env`, then run:

```powershell
docker compose up -d --build
```

Docker starts MySQL, runs migrations, runs `admin-bootstrap`, starts the backend, then starts the frontend.

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:7000/api`
- API docs: `http://localhost:7000/docs`
- MySQL host port: `3307`

## Verification

Backend tests:

```powershell
python -m pytest backend\tests -q
```

Backend syntax/import check:

```powershell
python -m compileall backend\app backend\scripts
```

Frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

Configuration validation with local MySQL available:

```powershell
python backend\scripts\validate_configuration.py
```

## More Documentation

- `docs/LOCAL_MYSQL_SETUP.md`
- `docs/ADMIN_SETUP.md`
- `docs/EMAIL_SETUP.md`
- `docs/PRODUCTION_DEPLOYMENT.md`
