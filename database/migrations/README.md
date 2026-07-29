# ONIRIA MySQL Migrations

Apply only the MySQL migration files listed in `backend/scripts/run_migrations.py` or `docker-compose.yml`.

Do not bulk-run every `.sql` file in this directory. The older files below are PostgreSQL drafts and are intentionally excluded from the MySQL runner:

- `001_extensions.sql`
- `002_properties.sql`
- `003_masterplan_amenities.sql`
- `004_anonymous_sessions.sql`

The active MySQL sequence starts with `001_database_setup.sql` and continues through `014_audit_logs.sql`.
