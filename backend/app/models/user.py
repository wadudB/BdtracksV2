from sqlalchemy import String, Boolean, Enum, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func

from app.db.base_class import Base


class User(Base):
    """User model for authentication and recording prices"""
    
    # Override the tablename to match what's in the database
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "user"
    
    username: Mapped[str] = mapped_column(String(50), index=True, unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), index=True, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    role: Mapped[str] = mapped_column(
        Enum("admin", "data_entry", "viewer", name="user_role"),
        default="viewer",
        nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, 
        nullable=False, 
        server_default=func.current_timestamp()
    ) 