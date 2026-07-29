from __future__ import annotations

import asyncio
import os

try:
    import aiomysql
except ModuleNotFoundError:
    raise SystemExit("aiomysql is not installed. Run: backend\\.venv\\Scripts\\python.exe -m pip install -r backend\\requirements.txt")


async def main() -> None:
    required = ["MYSQL_HOST", "MYSQL_DATABASE", "MYSQL_USER", "MYSQL_PASSWORD"]
    missing = [name for name in required if not os.getenv(name)]
    if missing:
        raise SystemExit(f"Missing required environment values: {', '.join(missing)}")

    connection = await aiomysql.connect(
        host=os.getenv("MYSQL_HOST"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        db=os.getenv("MYSQL_DATABASE"),
    )
    async with connection.cursor() as cursor:
        await cursor.execute("SELECT DATABASE(), COUNT(*) FROM staff_roles")
        row = await cursor.fetchone()
        print(f"Connected to {row[0]}; staff_roles={row[1]}")
    connection.close()


if __name__ == "__main__":
    asyncio.run(main())
