from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Any, List, Optional

from app import schemas, crud
from app.db.session import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.AllAccidentsData])
def get_all_accidents_data(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of records to return"),
    district: Optional[str] = Query(None, description="Filter by district"),
    accident_type: Optional[str] = Query(None, description="Filter by accident type"),
) -> Any:
    """
    Retrieve all accidents data with pagination and optional filters.
    Limited to maximum 50 records per request for performance.
    """
    # Ensure limit doesn't exceed 50
    limit = min(limit, 50)
    
    accident_records = crud.all_accidents_data.get_multi_with_filters(
        db, 
        skip=skip, 
        limit=limit,
        district=district,
        accident_type=accident_type
    )
    return accident_records


@router.get("/count", response_model=dict)
def get_all_accidents_count(
    db: Session = Depends(get_db),
    district: Optional[str] = Query(None, description="Filter by district"),
    accident_type: Optional[str] = Query(None, description="Filter by accident type"),
) -> Any:
    """
    Get total count of accident records with optional filters.
    """
    total_count = crud.all_accidents_data.get_count_with_filters(
        db,
        district=district,
        accident_type=accident_type
    )
    return {"total_count": total_count}


@router.get("/{u_id}", response_model=schemas.AllAccidentsData)
def get_accident_by_id(
    *,
    db: Session = Depends(get_db),
    u_id: int,
) -> Any:
    """
    Get specific accident record by u_id.
    """
    accident_record = crud.all_accidents_data.get(db=db, id=u_id)
    if not accident_record:
        raise HTTPException(
            status_code=404,
            detail=f"Accident record with u_id {u_id} not found",
        )
    return accident_record


@router.post("/", response_model=schemas.AllAccidentsData, status_code=201)
def create_accident_record(
    *,
    db: Session = Depends(get_db),
    accident_data_in: schemas.AllAccidentsDataCreate,
) -> Any:
    """
    Create new accident data record.
    """
    accident_record = crud.all_accidents_data.create(db=db, obj_in=accident_data_in)
    return accident_record


@router.put("/{u_id}", response_model=schemas.AllAccidentsData)
def update_accident_record(
    *,
    db: Session = Depends(get_db),
    u_id: int,
    accident_data_in: schemas.AllAccidentsDataUpdate,
) -> Any:
    """
    Update accident record by u_id.
    """
    accident_record = crud.all_accidents_data.get(db=db, id=u_id)
    if not accident_record:
        raise HTTPException(
            status_code=404,
            detail=f"Accident record with u_id {u_id} not found",
        )
    
    accident_record = crud.all_accidents_data.update(
        db=db, db_obj=accident_record, obj_in=accident_data_in
    )
    return accident_record


@router.delete("/{u_id}")
def delete_accident_record(
    *,
    db: Session = Depends(get_db),
    u_id: int,
) -> Any:
    """
    Delete accident record by u_id.
    """
    accident_record = crud.all_accidents_data.get(db=db, id=u_id)
    if not accident_record:
        raise HTTPException(
            status_code=404,
            detail=f"Accident record with u_id {u_id} not found",
        )
    
    crud.all_accidents_data.remove(db=db, id=u_id)
    return {"message": f"Accident record with u_id {u_id} deleted successfully"} 