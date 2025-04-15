from pydantic import BaseModel, Field
from typing import Optional, List, Union, Any
from datetime import datetime


# Shared properties
class CommodityBase(BaseModel):
    name: Optional[str] = None
    bengali_name: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None


# Properties to receive on commodity creation
class CommodityCreate(CommodityBase):
    name: str
    category: str
    unit: str


# Properties to receive on commodity update
class CommodityUpdate(CommodityBase):
    pass


# Properties shared by models stored in DB
class CommodityInDBBase(CommodityBase):
    id: int
    name: str
    category: str
    unit: str
    created_at: datetime

    class Config:
        from_attributes = True


# Properties to return to client
class Commodity(CommodityInDBBase):
    pass


# Additional properties for detailed view
class PricePoint(BaseModel):
    date: str
    price: int


class RegionalPrice(BaseModel):
    region: str
    price: int
    change: int


class CommodityDetail(Commodity):
    current_price: Optional[int] = None
    price_history: Optional[List[PricePoint]] = []
    regional_prices: Optional[List[RegionalPrice]] = []


# Simple schema for dropdown selection
class CommodityInDropdown(BaseModel):
    id: int
    name: str
    bengali_name: Optional[str] = None
    
    class Config:
        from_attributes = True 