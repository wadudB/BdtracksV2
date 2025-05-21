from typing import List, Optional, Dict, Any, Union
from datetime import date

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.price_record import PriceRecord
from app.schemas.price_record import PriceRecordCreate, PriceRecordUpdate
from app.crud.crud_location import location as crud_location


class CRUDPriceRecord(CRUDBase[PriceRecord, PriceRecordCreate, PriceRecordUpdate]):
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, 
        commodity_id: Optional[int] = None, region_id: Optional[int] = None,
        start_date: Optional[date] = None, end_date: Optional[date] = None,
        location_id: Optional[int] = None
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
        if location_id:
            query = query.filter(self.model.location_id == location_id)
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
    
    def create_with_location(
        self, db: Session, *, obj_in: PriceRecordCreate
    ) -> PriceRecord:
        """
        Create a price record with an associated location
        
        The frontend always sends complete location data.
        """
        # Location data must be provided (should be validated at schema level)
        if not obj_in.location:
            raise ValueError("Location data is required")
        
        # Try to find or create a location with the provided data
        location = crud_location.get_or_create(db, obj_in=obj_in.location)
        
        # Create price record with the location reference
        price_data = obj_in.dict(exclude={"location"})
        price_data["location_id"] = location.id
        
        db_obj = self.model(**price_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


price_record = CRUDPriceRecord(PriceRecord) 