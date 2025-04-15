from sqlalchemy import String, Integer, Boolean, Text, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func

from app.db.base_class import Base


class Commodity(Base):
    """Commodity model for storing commodity information"""
    
    # Override the tablename to match what's in the database
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "commodity"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    bengali_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    unit: Mapped[str] = mapped_column(String(20), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    min_price: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_price: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, 
        nullable=False, 
        server_default=func.current_timestamp()
    )
    
    # Relationships will be set up in app.db.setup_relationships 