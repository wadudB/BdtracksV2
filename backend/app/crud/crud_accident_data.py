from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.crud.base import CRUDBase
from app.models.accident_data import AccidentData
from app.schemas.accident_data import AccidentDataCreate, AccidentDataUpdate


class CRUDAccidentData(CRUDBase[AccidentData, AccidentDataCreate, AccidentDataUpdate]):
    def get_multi_ordered_by_year(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[AccidentData]:
        """
        Get multiple accident data records ordered by year descending
        """
        return (
            db.query(self.model)
            .order_by(desc(self.model.year))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_year(self, db: Session, *, year: int) -> Optional[AccidentData]:
        """
        Get accident data by year
        """
        return db.query(self.model).filter(self.model.year == year).first()


accident_data = CRUDAccidentData(AccidentData) 