from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Shared properties
class LocationBase(BaseModel):
    name: str
    address: Optional[str] = Field(None, description="Formatted address of the location")
    latitude: float = Field(..., description="Latitude coordinate of the location")
    longitude: float = Field(..., description="Longitude coordinate of the location")
    place_id: Optional[str] = Field(None, description="Google Maps Place ID")
    poi_id: Optional[str] = Field(None, description="Google Maps POI ID")


# Properties to receive on item creation
class LocationCreate(LocationBase):
    pass


# Properties to receive on item update
class LocationUpdate(LocationBase):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    place_id: Optional[str] = None
    poi_id: Optional[str] = None


# Properties shared by models stored in DB
class LocationInDBBase(LocationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        orm_mode = True  # Keep backward compatibility


# Properties to return to client
class Location(LocationInDBBase):
    pass 