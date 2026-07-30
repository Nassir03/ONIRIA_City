# Admin Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill MySQL settings and admin bootstrap values:

```text
ONIRIA_ADMIN_FULL_NAME=ONIRIA Administrator
ONIRIA_ADMIN_EMAIL=admin@example.com
ONIRIA_ADMIN_PASSWORD=<strong-password>
ONIRIA_ADMIN_PASSWORD_CONFIRM=<strong-password>
ONIRIA_ADMIN_UPDATE_PASSWORD=false
```

3. Run migrations:

```powershell
python backend\scripts\run_migrations.py
```

4. Run bootstrap:

```powershell
python backend\scripts\create_admin.py
```

5. Verify the configured administrator without printing secrets:

```powershell
python backend\scripts\verify_admin.py
```

Possible outcomes:

- `Administrator created`
- `Administrator already exists`
- `Administrator role added`
- `Administrator is inactive`
- `Required values are missing`

Existing administrator passwords are not changed unless `ONIRIA_ADMIN_UPDATE_PASSWORD=true`.

## Testing Login

Start backend and frontend, then open:

```text
http://127.0.0.1:3000/admin/login
```

If login says `Invalid staff credentials`, verify in MySQL:

- `staff_users.email` matches the requested email.
- `staff_users.is_active = 1`.
- `staff_users.password_hash` is a valid hash for the password.
- `staff_roles.role_key = 'administrator'` exists.
- `staff_user_roles` links the user to the administrator role.
- Frontend and backend point at the same MySQL database.
