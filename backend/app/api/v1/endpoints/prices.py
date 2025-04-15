from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, List, Optional
from datetime import date

from app import schemas, crud
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.PriceRecord])
def read_price_records(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    commodity_id: Optional[int] = None,
    region_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> Any:
    """
    Retrieve price records with filtering options.
    """
    prices = crud.price_record.get_multi(
        db, skip=skip, limit=limit, 
        commodity_id=commodity_id, 
        region_id=region_id,
        start_date=start_date,
        end_date=end_date
    )
    return prices


@router.post("/", response_model=schemas.PriceRecord, status_code=status.HTTP_201_CREATED)
def create_price_record(
    *,
    db: Session = Depends(get_db),
    price_in: schemas.PriceRecordCreate,
) -> Any:
    """
    Create new price record.
    """
    price = crud.price_record.create(db=db, obj_in=price_in)
    return price


@router.get("/{id}", response_model=schemas.PriceRecord)
def read_price_record(
    *,
    db: Session = Depends(get_db),
    id: int,
) -> Any:
    """
    Get price record by ID.
    """
    price = crud.price_record.get(db=db, id=id)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Price record not found",
        )
    return price


@router.put("/{id}", response_model=schemas.PriceRecord)
def update_price_record(
    *,
    db: Session = Depends(get_db),
    id: int,
    price_in: schemas.PriceRecordUpdate,
) -> Any:
    """
    Update a price record.
    """
    price = crud.price_record.get(db=db, id=id)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Price record not found",
        )
    price = crud.price_record.update(db=db, db_obj=price, obj_in=price_in)
    return price


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_price_record(
    *,
    db: Session = Depends(get_db),
    id: int,
):
    """
    Delete a price record.
    """
    price = crud.price_record.get(db=db, id=id)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Price record not found",
        )
    crud.price_record.remove(db=db, id=id) 