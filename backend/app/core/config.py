from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import ClassVar, Literal, Optional, Dict, Any, List
import secrets
from pydantic import validator, AnyHttpUrl, Field
import os


class Settings(BaseSettings):
    # Default to "development" if ENV environment variable is not set
    ENVIRONMENT: Literal["development", "production"] = "development"
    
    API_V1_STR: str = "/api/v1"
    # Generate a default secret key if not provided
    SECRET_KEY: str = Field(default_factory=lambda: secrets.token_urlsafe(32))
    # 60 minutes * 24 hours = 1 day
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    # BACKEND_CORS_ORIGINS is a comma-separated string of origins
    # e.g: "http://localhost:3000,http://localhost:8080"
    BACKEND_CORS_ORIGINS: str = ""  # Store as string initially

    # Process CORS origins as a property
    @property
    def CORS_ORIGINS(self) -> List[str]:
        if not self.BACKEND_CORS_ORIGINS:
            return []
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

    PROJECT_NAME: str = "BdTracks Commodity API"
    
    # Database settings with defaults for development
    MYSQL_SERVER: str
    MYSQL_PORT: int = 3306
    MYSQL_USER: str
    MYSQL_PASSWORD: str = ""
    MYSQL_DB: str = ""
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    env_state: ClassVar[str] = os.getenv("ENVIRONMENT", "development")
    env_file_name: ClassVar[str] = f".env.{env_state}"

    print(f"Loading environment from {env_file_name}")

    model_config = SettingsConfigDict(env_file=(".env", env_file_name),
                                      env_ignore_empty=True,
                                      extra="ignore")

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return f"mysql+pymysql://{values.get('MYSQL_USER')}:{values.get('MYSQL_PASSWORD')}@{values.get('MYSQL_SERVER')}:{values.get('MYSQL_PORT')}/{values.get('MYSQL_DB')}"

# Initialize settings once
settings = Settings() 