from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings"""
    # Database settings
    db_user: str = "cx"
    db_password: str = "cxpass"
    db_host: str = "localhost"
    db_port: str = "3307"
    db_name: str = "coveragex"

    # CORS settings
    cors_origins: list[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]

    @property
    def database_url(self) -> str:
        """Get the database URL"""
        return f"mysql+aiomysql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
