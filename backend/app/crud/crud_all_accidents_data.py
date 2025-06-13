from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.crud.base import CRUDBase
from app.models.all_accidents_data import AllAccidentsData
from app.schemas.all_accidents_data import AllAccidentsDataCreate, AllAccidentsDataUpdate


class CRUDAllAccidentsData(CRUDBase[AllAccidentsData, AllAccidentsDataCreate, AllAccidentsDataUpdate]):
    def get(self, db: Session, id: int) -> Optional[AllAccidentsData]:
        """Override to use u_id instead of id"""
        return db.query(self.model).filter(self.model.u_id == id).first()

    def remove(self, db: Session, *, id: int) -> AllAccidentsData:
        """Override to use u_id instead of id"""
        obj = db.query(self.model).filter(self.model.u_id == id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj

    def get_multi_ordered_by_date(
        self, db: Session, *, skip: int = 0, limit: int = 50
    ) -> List[AllAccidentsData]:
        """
        Get multiple accident records ordered by accident_datetime_from_url descending
        """
        return (
            db.query(self.model)
            .order_by(desc(self.model.accident_datetime_from_url))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_with_filters(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 50,
        district: Optional[str] = None,
        accident_type: Optional[str] = None
    ) -> List[AllAccidentsData]:
        """
        Get multiple accident records with optional filters
        """
        query = db.query(self.model)
        
        if district:
            query = query.filter(self.model.district_of_accident.ilike(f"%{district}%"))
        
        if accident_type:
            query = query.filter(self.model.accident_type.ilike(f"%{accident_type}%"))
        
        return (
            query
            .order_by(desc(self.model.accident_datetime_from_url))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_count(self, db: Session) -> int:
        """
        Get total count of accident records
        """
        return db.query(self.model).count()
    
    def get_count_with_filters(
        self, 
        db: Session,
        *, 
        district: Optional[str] = None,
        accident_type: Optional[str] = None
    ) -> int:
        """
        Get count of accident records with optional filters
        """
        query = db.query(self.model)
        
        if district:
            query = query.filter(self.model.district_of_accident.ilike(f"%{district}%"))
        
        if accident_type:
            query = query.filter(self.model.accident_type.ilike(f"%{accident_type}%"))
        
        return query.count()


all_accidents_data = CRUDAllAccidentsData(AllAccidentsData) 