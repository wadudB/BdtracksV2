from typing import List, Optional
from datetime import date

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.price_record import PriceRecord
from app.schemas.price_record import PriceRecordCreate, PriceRecordUpdate


class CRUDPriceRecord(CRUDBase[PriceRecord, PriceRecordCreate, PriceRecordUpdate]):
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, 
        commodity_id: Optional[int] = None, region_id: Optional[int] = None,
        start_date: Optional[date] = None, end_date: Optional[date] = None
    ) -> List[PriceRecord]:
        query = db.query(self.model)
        if commodity_id:
            query = query.filter(self.model.commodity_id == commodity_id)
        if region_id:
            query = query.filter(self.model.region_id == region_id)
        if start_date:
            query = query.filter(self.model.recorded_at >= start_date)
        if end_date:
            query = query.filter(self.model.recorded_at <= end_date)
        return query.order_by(self.model.recorded_at.desc()).offset(skip).limit(limit).all()
    
    def get_by_commodity(
        self, db: Session, *, commodity_id: int, skip: int = 0, limit: int = 100
    ) -> List[PriceRecord]:
        return (
            db.query(self.model)
            .filter(self.model.commodity_id == commodity_id)
            .order_by(self.model.recorded_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_region(
        self, db: Session, *, region_id: int, skip: int = 0, limit: int = 100
    ) -> List[PriceRecord]:
        return (
            db.query(self.model)
            .filter(self.model.region_id == region_id)
            .order_by(self.model.recorded_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )


price_record = CRUDPriceRecord(PriceRecord) 