# ONIRIA City Backend

FastAPI backend for public ONIRIA City property content, enquiries, AI, and WhatsApp integrations.

This first implementation covers:

- Application setup, CORS, logging, error handling, and rate limiting
- Environment configuration
- Optional PostgreSQL connection pool
- Health endpoint
- Public properties, collections, masterplan zones, and search APIs

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 7000
```

Then open:

- `http://127.0.0.1:7000/api/health`
- `http://127.0.0.1:7000/docs`

If `DATABASE_URL` is not set, the public content APIs use seeded demo data.

## Test locally

From the project root:

```powershell
python -m pytest backend\tests
```

With the server running on port `7000`, test the public API:

```powershell
curl.exe http://127.0.0.1:7000/api/health
curl.exe http://127.0.0.1:7000/api/properties
curl.exe "http://127.0.0.1:7000/api/properties?page=1&page_size=2"
curl.exe "http://127.0.0.1:7000/api/properties?collection=v-avenue"
curl.exe "http://127.0.0.1:7000/api/properties?property_type=villa"
curl.exe "http://127.0.0.1:7000/api/properties?bedrooms=3"
curl.exe http://127.0.0.1:7000/api/properties/skyline-villa
curl.exe http://127.0.0.1:7000/api/collections
curl.exe http://127.0.0.1:7000/api/masterplan/zones
curl.exe "http://127.0.0.1:7000/api/search?q=villa"
curl.exe "http://127.0.0.1:7000/api/search?q=commercial&limit=5"
```

Check validation with intentionally wrong values:

```powershell
curl.exe -i "http://127.0.0.1:7000/api/properties?page=0"
curl.exe -i "http://127.0.0.1:7000/api/search?q=x"
curl.exe -i "http://127.0.0.1:7000/api/properties/bad<script>"
```

## Run with Docker

From the project root:

```powershell
docker compose up --build
```

The API will be available at `http://127.0.0.1:7000`.

For real deployment values, create `backend\.env` from `backend\.env.example` and update `docker-compose.yml` to point at it.
