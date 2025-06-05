from sqlalchemy import String, Integer, ForeignKey, Date, Text, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from datetime import date
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func

from app.db.base_class import Base


class PriceRecord(Base):
    """Price record model for storing commodity prices by region"""
    
    # Override the tablename to match what's in the database
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "pricerecord"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    commodity_id: Mapped[int] = mapped_column(Integer, ForeignKey("commodity.id"), nullable=False, index=True)
    region_id: Mapped[int] = mapped_column(Integer, ForeignKey("region.id"), nullable=False, index=True)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    recorded_by: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("user.id"), nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    source_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("location.id"), nullable=True)
    recorded_at: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, 
        nullable=False, 
        server_default=func.current_timestamp()
    )
    
    __table_args__ = (
        Index('idx_commodity_recorded_at', 'commodity_id', 'recorded_at'),
        Index('idx_region_recorded_at', 'region_id', 'recorded_at'),
    )
    
    # Relationships will be set up in app.db.setup_relationships 