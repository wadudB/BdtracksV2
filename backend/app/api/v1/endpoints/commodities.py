from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, List, Optional

from app import schemas, crud
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Commodity])
def read_commodities(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
) -> Any:
    """
    Retrieve commodities.
    """
    commodities = crud.commodity.get_multi(db, skip=skip, limit=limit, category=category)
    return commodities


@router.get("/dropdown", response_model=List[schemas.CommodityInDropdown])
def get_commodities_for_dropdown(
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a simplified list of commodities for dropdown selection.
    """
    commodities = crud.commodity.get_multi(db)
    return commodities


@router.post("/", response_model=schemas.Commodity, status_code=status.HTTP_201_CREATED)
def create_commodity(
    *,
    db: Session = Depends(get_db),
    commodity_in: schemas.CommodityCreate,
) -> Any:
    """
    Create new commodity.
    """
    commodity = crud.commodity.create(db=db, obj_in=commodity_in)
    return commodity


@router.get("/{id}", response_model=schemas.CommodityDetail)
def read_commodity(
    *,
    db: Session = Depends(get_db),
    id: int,
) -> Any:
    """
    Get commodity by ID.
    """
    commodity = crud.commodity.get(db=db, id=id)
    if not commodity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commodity not found",
        )
    return commodity


@router.put("/{id}", response_model=schemas.Commodity)
def update_commodity(
    *,
    db: Session = Depends(get_db),
    id: int,
    commodity_in: schemas.CommodityUpdate,
) -> Any:
    """
    Update an commodity.
    """
    commodity = crud.commodity.get(db=db, id=id)
    if not commodity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commodity not found",
        )
    commodity = crud.commodity.update(db=db, db_obj=commodity, obj_in=commodity_in)
    return commodity


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_commodity(
    *,
    db: Session = Depends(get_db),
    id: int,
):
    """
    Delete an commodity.
    """
    commodity = crud.commodity.get(db=db, id=id)
    if not commodity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commodity not found",
        )
    crud.commodity.remove(db=db, id=id) 