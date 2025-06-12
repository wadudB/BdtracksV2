from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime, date


# Shared properties
class AccidentDataBase(BaseModel):
    year: int
    total_accidents: Optional[int]
    total_killed: Optional[int]
    total_injured: Optional[int]
    daily_deaths: Optional[str]
    daily_injured: Optional[str]
    monthly_deaths: Optional[str]
    monthly_injured: Optional[str]
    accident_hotspot: Optional[str]
    vehicles_involved: Optional[str]
    date: Optional[date]
    accidents_by_district: Optional[str]


# Properties to receive on accident data creation
class AccidentDataCreate(AccidentDataBase):
    pass


# Properties to receive on accident data update
class AccidentDataUpdate(BaseModel):
    year: Optional[int] = None
    total_accidents: Optional[int] = None
    total_killed: Optional[int] = None
    total_injured: Optional[int] = None
    daily_deaths: Optional[str] = None
    daily_injured: Optional[str] = None
    monthly_deaths: Optional[str] = None
    monthly_injured: Optional[str] = None
    accident_hotspot: Optional[str] = None
    vehicles_involved: Optional[str] = None
    date: Optional[date] = None
    accidents_by_district: Optional[str] = None


# Properties shared by models stored in DB
class AccidentDataInDBBase(AccidentDataBase):
    id: int
    created_at: datetime
    last_updated: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# Properties to return to client
class AccidentData(AccidentDataInDBBase):
    pass


# Properties stored in DB
class AccidentDataInDB(AccidentDataInDBBase):
    pass 