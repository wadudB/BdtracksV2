from sqlalchemy import String, Boolean, Float, ForeignKey, event, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func

from app.db.base_class import Base


class Region(Base):
    """Region model representing geographic areas in Bangladesh"""
    
    # Override the tablename to match what's in the database
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "region"
    
    name: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    bengali_name: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    latitude: Mapped[float] = mapped_column(Float(precision=10, decimal_return_scale=6), nullable=False)
    longitude: Mapped[float] = mapped_column(Float(precision=10, decimal_return_scale=6), nullable=False)
    is_division: Mapped[bool] = mapped_column(Boolean, default=True)
    parent_region_id: Mapped[Optional[int]] = mapped_column(ForeignKey("region.id"), nullable=True)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, 
        nullable=False, 
        server_default=func.current_timestamp()
    )
    
    # Relationships will be set up in app.db.setup_relationships 