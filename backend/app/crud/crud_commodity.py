from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.commodity import Commodity
from app.schemas.commodity import CommodityCreate, CommodityUpdate


class CRUDCommodity(CRUDBase[Commodity, CommodityCreate, CommodityUpdate]):
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, category: Optional[str] = None
    ) -> List[Commodity]:
        query = db.query(self.model)
        if category:
            query = query.filter(self.model.category == category)
        return query.offset(skip).limit(limit).all()


commodity = CRUDCommodity(Commodity) 