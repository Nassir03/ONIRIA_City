# ONIRIA City

Full-stack ONIRIA City website with a FastAPI backend, MySQL database, public enquiry workflow, lead management APIs, and a private staff dashboard.

## Environment Files

The project uses two environment files:

- `.env.example` for the Next.js frontend API URL.
- `backend/.env.example` for FastAPI local settings.

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

Docker uses demo local credentials inside `docker-compose.yml`. Replace them with real secrets or an external secret manager before deployment.

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

Admin email must be a valid email address containing `@`. Admin password must be at least 10 characters and include uppercase, lowercase, number and symbol.

## Use Local MySQL On Port 3306

If you are using MySQL installed on your machine instead of the Docker MySQL container, install backend dependencies and apply the schema like this:

```powershell
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt

$env:MYSQL_HOST="127.0.0.1"
$env:MYSQL_PORT="3306"
$env:MYSQL_DATABASE="oniria_city"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="<your-local-mysql-password>"

backend\.venv\Scripts\python.exe backend\scripts\run_migrations.py
backend\.venv\Scripts\python.exe backend\scripts\check_database.py
```

To make the backend use local MySQL through `backend\.env`, set either `DATABASE_URL` or all `MYSQL_*` values. Example:

```text
DATABASE_URL=mysql://root:<your-local-mysql-password>@127.0.0.1:3306/oniria_city
```

To create the first admin without interactive prompts:

```powershell
$env:ONIRIA_ADMIN_FULL_NAME="ONIRIA Admin"
$env:ONIRIA_ADMIN_EMAIL="admin@example.com"
$env:ONIRIA_ADMIN_PASSWORD="<strong-admin-password>"
$env:ONIRIA_ADMIN_PASSWORD_CONFIRM="<strong-admin-password>"
backend\.venv\Scripts\python.exe backend\scripts\create_admin.py
```

To run the backend manually on port `7000`:

```powershell
backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 7000
```

To run the frontend manually:

```powershell
npm.cmd install
npm.cmd run dev
```

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

- `POST /api/consultations`
- `POST /api/site-visits`
- `POST /api/commercial-enquiries`
- `GET /api/admin/leads` after staff login
- `GET /api/admin/leads/{lead_id}` after staff login
