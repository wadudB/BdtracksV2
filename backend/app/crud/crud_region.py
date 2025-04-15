from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.region import Region
from app.schemas.region import RegionCreate, RegionUpdate


class CRUDRegion(CRUDBase[Region, RegionCreate, RegionUpdate]):
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, is_division: Optional[bool] = None
    ) -> List[Region]:
        query = db.query(self.model)
        if is_division is not None:
            query = query.filter(self.model.is_division == is_division)
        return query.offset(skip).limit(limit).all()


region = CRUDRegion(Region) 