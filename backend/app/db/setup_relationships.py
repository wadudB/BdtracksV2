"""
This module sets up SQLAlchemy relationships after all models are defined.
This avoids circular import problems.
"""
from sqlalchemy.orm import relationship
from app.models.commodity import Commodity
from app.models.region import Region
from app.models.price_record import PriceRecord
from app.models.supply_chain_data import SupplyChainData
from app.models.supply_chain_stage import SupplyChainStage
from app.models.price_history import PriceHistoryAggregated

# Setup Commodity relationships
Commodity.price_records = relationship("PriceRecord", back_populates="commodity")
Commodity.supply_chain_data = relationship("SupplyChainData", back_populates="commodity")
Commodity.price_history = relationship("PriceHistoryAggregated", back_populates="commodity")

# Setup Region relationships
Region.price_records = relationship("PriceRecord", back_populates="region")
Region.supply_chain_data = relationship("SupplyChainData", back_populates="region")
Region.parent_region = relationship("Region", remote_side=[Region.id], backref="sub_regions", 
                                  foreign_keys=[Region.parent_region_id])

# Setup PriceRecord relationships
PriceRecord.commodity = relationship("Commodity", back_populates="price_records")
PriceRecord.region = relationship("Region", back_populates="price_records")

# Setup SupplyChainData relationships
SupplyChainData.commodity = relationship("Commodity", back_populates="supply_chain_data")
SupplyChainData.region = relationship("Region", back_populates="supply_chain_data")
SupplyChainData.stage = relationship("SupplyChainStage", back_populates="supply_chain_data")

# Setup SupplyChainStage relationships
SupplyChainStage.supply_chain_data = relationship("SupplyChainData", back_populates="stage")

# Setup PriceHistory relationships
PriceHistoryAggregated.commodity = relationship("Commodity", back_populates="price_history")

def setup_relationships():
    """Function to import and trigger relationship setup"""
    pass  # The relationships are set up when this module is imported 