from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any, List

from app import schemas, crud
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.AccidentData])
def get_accident_data(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve accident data ordered by year descending.
    This endpoint migrates the functionality from the old Flask /data endpoint.
    """
    accident_records = crud.accident_data.get_multi_ordered_by_year(
        db, skip=skip, limit=limit
    )
    return accident_records


@router.get("/{year}", response_model=schemas.AccidentData)
def get_accident_data_by_year(
    *,
    db: Session = Depends(get_db),
    year: int,
) -> Any:
    """
    Get accident data by specific year.
    """
    accident_record = crud.accident_data.get_by_year(db=db, year=year)
    if not accident_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Accident data for year {year} not found",
        )
    return accident_record


@router.post("/", response_model=schemas.AccidentData, status_code=status.HTTP_201_CREATED)
def create_accident_data(
    *,
    db: Session = Depends(get_db),
    accident_data_in: schemas.AccidentDataCreate,
) -> Any:
    """
    Create new accident data record.
    """
    # Check if data for this year already exists
    existing_data = crud.accident_data.get_by_year(db=db, year=accident_data_in.year)
    if existing_data:
        raise HTTPException(
            status_code=400,
            detail=f"Accident data for year {accident_data_in.year} already exists",
        )
    
    accident_data = crud.accident_data.create(db=db, obj_in=accident_data_in)
    return accident_data


@router.put("/{year}", response_model=schemas.AccidentData)
def update_accident_data(
    *,
    db: Session = Depends(get_db),
    year: int,
    accident_data_in: schemas.AccidentDataUpdate,
) -> Any:
    """
    Update accident data for a specific year.
    """
    accident_data = crud.accident_data.get_by_year(db=db, year=year)
    if not accident_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Accident data for year {year} not found",
        )
    
    accident_data = crud.accident_data.update(
        db=db, db_obj=accident_data, obj_in=accident_data_in
    )
    return accident_data


@router.delete("/{year}")
def delete_accident_data(
    *,
    db: Session = Depends(get_db),
    year: int,
) -> Any:
    """
    Delete accident data for a specific year.
    """
    accident_data = crud.accident_data.get_by_year(db=db, year=year)
    if not accident_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Accident data for year {year} not found",
        )
    
    accident_data = crud.accident_data.remove(db=db, id=accident_data.id)
    return {"message": f"Accident data for year {year} deleted successfully"} 