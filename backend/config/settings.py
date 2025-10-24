from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# load_dotenv()

class Settings(BaseSettings):
    """Application settings"""
    # Database settings if you run without docker
    db_user: str
    db_password: str 
    db_host: str 
    db_port: str
    db_name: str

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
