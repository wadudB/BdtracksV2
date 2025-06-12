from sqlalchemy import String, Integer, Date, DateTime, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from datetime import datetime, date
from sqlalchemy.ext.declarative import declared_attr

from app.db.base_class import Base


class AccidentData(Base):
    """Model for storing accident and traffic data statistics"""
    
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "accident_data_summary"
    
    # Year field
    year: Mapped[int] = mapped_column(Integer, nullable=False, unique=True, index=True)
    
    # Accident statistics
    total_accidents: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_killed: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_injured: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Daily statistics (using Text for longtext equivalent)
    daily_deaths: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    daily_injured: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Monthly statistics
    monthly_deaths: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    monthly_injured: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Location and vehicle data
    accident_hotspot: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    vehicles_involved: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Metadata
    last_updated: Mapped[Optional[datetime]] = mapped_column(
        DateTime, 
        nullable=True,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )
    date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    
    # District-wise accident data
    accidents_by_district: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    def __repr__(self) -> str:
        return f"<AccidentData(year={self.year}, total_accidents={self.total_accidents})>" 