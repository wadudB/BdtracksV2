"""
This module sets up SQLAlchemy relationships after all models are defined.
This avoids circular import problems.
"""
from sqlalchemy.orm import relationship
from app.models.commodity import Commodity
from app.models.region import Region
from app.models.price_record import PriceRecord
from app.models.location import Location

# Setup Commodity relationships
Commodity.price_records = relationship("PriceRecord", back_populates="commodity")

# Setup Region relationships
Region.price_records = relationship("PriceRecord", back_populates="region")

# Setup PriceRecord relationships
PriceRecord.commodity = relationship("Commodity", back_populates="price_records")
PriceRecord.region = relationship("Region", back_populates="price_records")
PriceRecord.location = relationship("Location", foreign_keys=[PriceRecord.location_id], back_populates="price_records")

# Setup Location relationships
Location.price_records = relationship("PriceRecord", back_populates="location", foreign_keys=[PriceRecord.location_id])

def setup_relationships():
    """Function to import and trigger relationship setup"""
    pass  # The relationships are set up when this module is imported 