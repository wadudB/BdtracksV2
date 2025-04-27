from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


# Shared properties
class PriceRecordBase(BaseModel):
    commodity_id: int
    region_id: int
    price: int
    recorded_by: Optional[int] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    address: Optional[str] = Field(None, description="Formatted address of the price record location")
    name: Optional[str] = Field(None, description="Name of the location from Google Maps")
    latitude: Optional[float] = Field(None, description="Latitude coordinate of the price record location")
    longitude: Optional[float] = Field(None, description="Longitude coordinate of the price record location")
    recorded_at: date


# Properties to receive on item creation
class PriceRecordCreate(PriceRecordBase):
    pass


# Properties to receive on item update
class PriceRecordUpdate(PriceRecordBase):
    commodity_id: Optional[int] = None
    region_id: Optional[int] = None
    price: Optional[int] = None
    address: Optional[str] = Field(None, description="Formatted address of the price record location")
    latitude: Optional[float] = Field(None, description="Latitude coordinate of the price record location")
    longitude: Optional[float] = Field(None, description="Longitude coordinate of the price record location")
    recorded_at: Optional[date] = None


# Properties shared by models stored in DB
class PriceRecordInDBBase(PriceRecordBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
        # Keep backward compatibility with older versions
        orm_mode = True


# Properties to return to client
class PriceRecord(PriceRecordInDBBase):
    pass 