from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


# Supply Chain Stage
class SupplyChainStageBase(BaseModel):
    name: str
    description: Optional[str] = None
    order_index: int


class SupplyChainStageCreate(SupplyChainStageBase):
    pass


class SupplyChainStageUpdate(SupplyChainStageBase):
    name: Optional[str] = None
    order_index: Optional[int] = None


class SupplyChainStageInDBBase(SupplyChainStageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SupplyChainStage(SupplyChainStageInDBBase):
    pass


# Supply Chain Data
class SupplyChainDataBase(BaseModel):
    commodity_id: int
    stage_id: int
    price: int
    region_id: Optional[int] = None
    stakeholders: Optional[int] = None
    location: Optional[str] = None
    recorded_at: date


class SupplyChainDataCreate(SupplyChainDataBase):
    pass


class SupplyChainDataUpdate(SupplyChainDataBase):
    commodity_id: Optional[int] = None
    stage_id: Optional[int] = None
    price: Optional[int] = None
    recorded_at: Optional[date] = None


class SupplyChainDataInDBBase(SupplyChainDataBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SupplyChainData(SupplyChainDataInDBBase):
    pass 