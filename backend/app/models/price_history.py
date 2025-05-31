from sqlalchemy import Integer, ForeignKey, Date, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import date
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func

from app.db.base_class import Base


class PriceHistoryAggregated(Base):
    """Aggregated price history for analytics and trends"""
    
    # Override the tablename to match what's in the database
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "pricehistoryaggregated"
    
    commodity_id: Mapped[int] = mapped_column(ForeignKey("commodity.id"), nullable=False)
    region_id: Mapped[int] = mapped_column(ForeignKey("region.id"), nullable=False)
    avg_price: Mapped[int] = mapped_column(Integer, nullable=False)
    min_price: Mapped[int] = mapped_column(Integer, nullable=False)
    max_price: Mapped[int] = mapped_column(Integer, nullable=False)
    period: Mapped[str] = mapped_column(
        Enum("daily", "weekly", "monthly", "quarterly", "yearly", name="aggregation_period"),
        nullable=False
    )
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, 
        nullable=False, 
        server_default=func.current_timestamp()
    ) 