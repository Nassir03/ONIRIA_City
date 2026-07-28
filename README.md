# ONIRIA City

Backend implementation for ONIRIA City public property APIs.

## Quick Start

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 7000
```

Open `http://127.0.0.1:7000/docs` for the interactive API docs.

## Run Tests

From the project root:

```powershell
python -m pytest backend\tests
```

## Docker

Start Docker Desktop first, then run:

```powershell
docker compose up --build
```

The backend will run at `http://127.0.0.1:7000`.
