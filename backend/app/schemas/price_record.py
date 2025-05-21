from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date, datetime
from app.schemas.location import LocationCreate, Location


# Shared properties
class PriceRecordBase(BaseModel):
    commodity_id: int
    region_id: int
    price: int
    recorded_by: Optional[int] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    location_id: Optional[int] = Field(None, description="ID of the associated location")
    recorded_at: date


# Properties to receive on item creation
class PriceRecordCreate(PriceRecordBase):
    location: Optional[LocationCreate] = Field(None, description="Location details to create")
    
    @validator('location', always=True)
    def validate_location(cls, v, values):
        """Validate that location data is provided (frontend always sends complete location data)"""
        if not v:
            raise ValueError("Location data is required")
        return v


# Properties to receive on item update
class PriceRecordUpdate(BaseModel):
    commodity_id: Optional[int] = None
    region_id: Optional[int] = None
    price: Optional[int] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    location_id: Optional[int] = None
    recorded_at: Optional[date] = None


# Properties shared by models stored in DB
class PriceRecordInDBBase(PriceRecordBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True  # Keep backward compatibility


# Properties to return to client
class PriceRecord(PriceRecordInDBBase):
    location: Optional[Location] = None 