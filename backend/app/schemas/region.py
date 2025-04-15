from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Shared properties
class RegionBase(BaseModel):
    name: str
    bengali_name: Optional[str] = None
    latitude: float
    longitude: float
    is_division: bool = True
    parent_region_id: Optional[int] = None


# Properties to receive on item creation
class RegionCreate(RegionBase):
    pass


# Properties to receive on item update
class RegionUpdate(RegionBase):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_division: Optional[bool] = None


# Properties shared by models stored in DB
class RegionInDBBase(RegionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# Properties to return to client
class Region(RegionInDBBase):
    pass 