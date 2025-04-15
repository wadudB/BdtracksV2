from sqlalchemy import String, Integer, ForeignKey, Date, event, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from datetime import date
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func

from app.db.base_class import Base


class SupplyChainData(Base):
    """Supply chain data for commodities at various stages"""
    
    # Override the tablename to match what's in the database
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "supplychaindata"
    
    commodity_id: Mapped[int] = mapped_column(ForeignKey("commodity.id"), nullable=False)
    stage_id: Mapped[int] = mapped_column(ForeignKey("supplychainstage.id"), nullable=False)
    region_id: Mapped[Optional[int]] = mapped_column(ForeignKey("region.id"), nullable=True)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    stakeholders: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    recorded_at: Mapped[date] = mapped_column(Date, nullable=False)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, 
        nullable=False, 
        server_default=func.current_timestamp()
    ) 