from pydantic import BaseModel
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
    recorded_at: date


# Properties to receive on item creation
class PriceRecordCreate(PriceRecordBase):
    pass


# Properties to receive on item update
class PriceRecordUpdate(PriceRecordBase):
    commodity_id: Optional[int] = None
    region_id: Optional[int] = None
    price: Optional[int] = None
    recorded_at: Optional[date] = None


# Properties shared by models stored in DB
class PriceRecordInDBBase(PriceRecordBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# Properties to return to client
class PriceRecord(PriceRecordInDBBase):
    pass 