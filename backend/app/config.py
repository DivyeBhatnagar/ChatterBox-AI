from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = Field(default="development", alias="APP_ENV")
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")

    openai_api_key: str = Field(alias="OPENAI_API_KEY")
    openai_base_url: str = Field(default="https://integrate.api.nvidia.com/v1", alias="OPENAI_BASE_URL")
    openai_model: str = Field(default="openai/gpt-oss-120b", alias="OPENAI_MODEL")

    allowed_origins_raw: str = Field(default="http://localhost:5173", alias="ALLOWED_ORIGINS")

    request_timeout_seconds: int = Field(default=45, alias="REQUEST_TIMEOUT_SECONDS")
    max_input_chars: int = Field(default=4000, alias="MAX_INPUT_CHARS")

    rate_limit_requests: int = Field(default=30, alias="RATE_LIMIT_REQUESTS")
    rate_limit_window_seconds: int = Field(default=60, alias="RATE_LIMIT_WINDOW_SECONDS")

    default_temperature: float = Field(default=0.7, alias="DEFAULT_TEMPERATURE")
    default_max_tokens: int = Field(default=1024, alias="DEFAULT_MAX_TOKENS")

    firebase_project_id: str = Field(default="", alias="FIREBASE_PROJECT_ID")
    firebase_service_account_path: str = Field(default="", alias="FIREBASE_SERVICE_ACCOUNT_PATH")
    firebase_service_account_json: str = Field(default="", alias="FIREBASE_SERVICE_ACCOUNT_JSON")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def allowed_origins(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins_raw.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
