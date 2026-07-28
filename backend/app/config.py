from functools import lru_cache
from typing import Annotated

from pydantic import AnyUrl, BeforeValidator, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def split_csv(value: str | list[str]) -> list[str]:
    if isinstance(value, list):
        return value
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings(BaseSettings):
    app_name: str = "ONIRIA City Backend"
    app_env: str = "local"
    app_debug: bool = False
    api_prefix: str = "/api"
    cors_origins: Annotated[list[str], BeforeValidator(split_csv)] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://127.0.0.1:3000"]
    )
    database_url: AnyUrl | None = None
    database_min_size: int = 1
    database_max_size: int = 5
    log_level: str = "INFO"
    rate_limit_per_minute: int = 120

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
