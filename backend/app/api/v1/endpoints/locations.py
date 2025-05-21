from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, List, Optional

from app import schemas, crud
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Location])
def read_locations(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve locations.
    """
    locations = crud.location.get_multi(db, skip=skip, limit=limit)
    return locations


@router.post("/", response_model=schemas.Location, status_code=status.HTTP_201_CREATED)
def create_location(
    *,
    db: Session = Depends(get_db),
    location_in: schemas.LocationCreate,
) -> Any:
    """
    Create new location.
    """
    location = crud.location.create(db=db, obj_in=location_in)
    return location


@router.get("/{id}", response_model=schemas.Location)
def read_location(
    *,
    db: Session = Depends(get_db),
    id: int,
) -> Any:
    """
    Get location by ID.
    """
    location = crud.location.get(db=db, id=id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    return location


@router.put("/{id}", response_model=schemas.Location)
def update_location(
    *,
    db: Session = Depends(get_db),
    id: int,
    location_in: schemas.LocationUpdate,
) -> Any:
    """
    Update a location.
    """
    location = crud.location.get(db=db, id=id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    location = crud.location.update(db=db, db_obj=location, obj_in=location_in)
    return location


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(
    *,
    db: Session = Depends(get_db),
    id: int,
):
    """
    Delete a location.
    """
    location = crud.location.get(db=db, id=id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Location not found",
        )
    crud.location.remove(db=db, id=id) 