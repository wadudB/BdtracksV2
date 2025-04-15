from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List, Optional

from app import schemas, crud
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Region])
def read_regions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    is_division: Optional[bool] = None,
) -> Any:
    """
    Retrieve regions.
    """
    regions = crud.region.get_multi(db, skip=skip, limit=limit, is_division=is_division)
    return regions


@router.post("/", response_model=schemas.Region, status_code=status.HTTP_201_CREATED)
def create_region(
    *,
    db: Session = Depends(get_db),
    region_in: schemas.RegionCreate,
) -> Any:
    """
    Create new region.
    """
    region = crud.region.create(db=db, obj_in=region_in)
    return region


@router.get("/{id}", response_model=schemas.Region)
def read_region(
    *,
    db: Session = Depends(get_db),
    id: int,
) -> Any:
    """
    Get region by ID.
    """
    region = crud.region.get(db=db, id=id)
    if not region:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Region not found",
        )
    return region


@router.get("/{id}/prices", response_model=List[schemas.PriceRecord])
def read_region_prices(
    *,
    db: Session = Depends(get_db),
    id: int,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get prices for a specific region.
    """
    region = crud.region.get(db=db, id=id)
    if not region:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Region not found",
        )
    return crud.price_record.get_by_region(db=db, region_id=id, skip=skip, limit=limit) 