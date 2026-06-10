from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "FiscalizaPay API"
    environment: str = "development"
    port: int = 8000

    database_url: str

    jwt_secret: str = Field(min_length=32)
    jwt_expires_minutes: int = 60
    jwt_algorithm: str = "HS256"

    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    allowed_hosts: str = "localhost,127.0.0.1,0.0.0.0"

    auth_nonce_expires_minutes: int = 10
    chain_id: int = 11155111

    db_pool_size: int = 2
    db_max_overflow: int = 0
    db_pool_timeout: int = 30

    explorer_url: str = "https://sepolia.etherscan.io"
    contract_address: str = ""
    blockchain_enabled: bool = False
    rpc_url: str = ""
    operator_private_key: str = ""
    blockchain_tx_timeout_seconds: int = 120

    @field_validator("database_url")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        """Railway costuma expor postgresql://; o projeto usa o driver psycopg v3."""
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]

    @property
    def allowed_host_list(self) -> list[str]:
        return [item.strip() for item in self.allowed_hosts.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
