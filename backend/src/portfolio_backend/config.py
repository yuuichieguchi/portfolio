"""Configuration for portfolio backend."""

import os
import json
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
        env_ignore_empty=True,  # Ignore empty string values
    )

    # Application
    app_name: str = "Portfolio Backend"
    app_version: str = "0.1.0"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS - Keep as string type to avoid Pydantic's JSON parsing
    cors_origins_raw: str = ""
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = Field(default=["*"])
    cors_allow_headers: list[str] = Field(default=["*"])

    # WebSocket
    ws_heartbeat_interval: float = 30.0
    ws_heartbeat_timeout: float = 60.0
    ws_max_connections: int = 1000

    # Chat
    max_message_length: int = 1000
    max_username_length: int = 50

    @property
    def cors_origins(self) -> list[str]:
        """Parse cors_origins_raw into a list of origins."""
        if not self.cors_origins_raw:
            return ["http://localhost:3000", "http://localhost:8000"]

        origins_str = self.cors_origins_raw
        # Handle both JSON array and comma-separated formats
        if origins_str.startswith("["):
            try:
                return json.loads(origins_str)
            except (json.JSONDecodeError, ValueError):
                pass

        # Simple comma-separated format
        return [origin.strip() for origin in origins_str.split(",") if origin.strip()]


settings = Settings()
