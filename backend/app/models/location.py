from sqlalchemy import String, Text, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func
from datetime import datetime

from app.db.base_class import Base


class Location(Base):
    """Location model for storing place details"""
    
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "location"
    
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    place_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    poi_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
    )
    
    # Relationships will be set up in app.db.setup_relationships 