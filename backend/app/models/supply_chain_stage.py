from sqlalchemy import String, Integer, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func

from app.db.base_class import Base


class SupplyChainStage(Base):
    """Supply chain stage model representing steps in the commodity supply chain"""
    
    # Override the tablename to match what's in the database
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "supplychainstage"
    
    name: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, 
        nullable=False, 
        server_default=func.current_timestamp()
    ) 