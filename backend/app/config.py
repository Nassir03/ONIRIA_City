from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ONIRIA City Backend"
    app_env: str = "local"
    app_debug: bool = False
    api_prefix: str = "/api"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    database_url: str | None = None
    mysql_host: str | None = None
    mysql_port: int = 3306
    mysql_database: str | None = None
    mysql_user: str | None = None
    mysql_password: str | None = None
    mysql_pool_size: int = 10
    mysql_max_overflow: int = 20
    database_min_size: int = 1
    database_max_size: int = 5
    log_level: str = "INFO"
    rate_limit_per_minute: int = 120
    whatsapp_verify_token: str = "oniria-demo-verify-token"
    whatsapp_app_secret: str | None = None
    frontend_url: str = "http://localhost:3000"
    mail_provider: str | None = None
    mail_from: str | None = None
    mail_from_name: str = "ONIRIA City"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("api_prefix")
    @classmethod
    def validate_api_prefix(cls, value: str) -> str:
        if not value.startswith("/"):
            raise ValueError("API_PREFIX must start with /")
        return value.rstrip("/") or "/api"

    @field_validator("database_url", mode="before")
    @classmethod
    def empty_database_url_is_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = str(value).strip()
        return value or None

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def effective_database_url(self) -> str | None:
        if self.database_url:
            return self.database_url
        if all([self.mysql_host, self.mysql_database, self.mysql_user, self.mysql_password]):
            return f"mysql://{self.mysql_user}:{self.mysql_password}@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"
        return None

    @field_validator("database_max_size")
    @classmethod
    def validate_pool_size(cls, value: int, info) -> int:
        min_size = info.data.get("database_min_size", 1)
        if value < min_size:
            raise ValueError("DATABASE_MAX_SIZE must be greater than or equal to DATABASE_MIN_SIZE")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
