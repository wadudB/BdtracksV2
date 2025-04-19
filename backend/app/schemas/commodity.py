from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from pydantic.alias_generators import to_camel


# Shared properties
class CommodityBase(BaseModel):
    name: Optional[str] = None
    bengali_name: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


# Properties to receive on commodity creation
class CommodityCreate(CommodityBase):
    pass


# Properties to receive on commodity update
class CommodityUpdate(CommodityBase):
    pass


# Properties shared by models stored in DB
class CommodityInDBBase(CommodityBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True, alias_generator=to_camel, populate_by_name=True
    )


# Properties to return to client
class Commodity(CommodityInDBBase):
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    current_price: Optional[int] = None
    weekly_change: Optional[float] = None
    monthly_change: Optional[float] = None
    yearly_change: Optional[float] = None


# Additional properties for detailed view
class PricePoint(BaseModel):
    date: str
    price: int
    
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True
    )


class RegionalPrice(BaseModel):
    region: str
    price: int
    change: int
    
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True
    )


class CommodityDetail(Commodity):
    price_history: Optional[List[PricePoint]] = []
    regional_prices: Optional[List[RegionalPrice]] = []


# Simple schema for dropdown selection
class CommodityInDropdown(BaseModel):
    id: int
    name: str
    bengali_name: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True, alias_generator=to_camel, populate_by_name=True
    )
