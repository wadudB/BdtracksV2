from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Any, List, Optional, Dict
from datetime import date, datetime, timedelta

from app import schemas, crud
from app.db.session import get_db
from app.models.region import Region
from app.models.price_record import PriceRecord

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


@router.get("/regions", response_model=Dict[str, List[Dict[str, Any]]])
def get_regional_prices(
    db: Session = Depends(get_db),
    commodity_id: int = Query(..., description="ID of the commodity to get regional prices for"),
    time_window: int = Query(30, description="Time window in days for price trends (7, 30, 90)")
) -> Any:
    """
    Get the most recent price for each region for a specific commodity, with trend analysis
    based on the specified time window.
    """
    # Check if commodity exists
    commodity = crud.commodity.get(db=db, id=commodity_id)
    if not commodity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commodity not found",
        )
    
    # Get all regions
    regions = db.query(Region).all()
    if not regions:
        return {"prices": []}
    
    # Calculate date range for time window
    today = datetime.now().date()
    start_date = today - timedelta(days=time_window)
    
    # Prepare the response data
    regional_prices = []
    
    for region in regions:
        # Get the most recent price record for this region and commodity
        latest_price = db.query(PriceRecord).filter(
            PriceRecord.commodity_id == commodity_id,
            PriceRecord.region_id == region.id
        ).order_by(
            PriceRecord.recorded_at.desc()
        ).first()
        
        # Only include regions with price data
        if latest_price:
            # Calculate trend for the time window
            start_window_price = db.query(PriceRecord).filter(
                PriceRecord.commodity_id == commodity_id,
                PriceRecord.region_id == region.id,
                PriceRecord.recorded_at <= (start_date + timedelta(days=5))  # Give a 5-day buffer for data availability
            ).order_by(
                PriceRecord.recorded_at.desc()
            ).first()
            
            # Calculate trend percentage (if we have historical data)
            trend_percentage = None
            if start_window_price and start_window_price.price > 0:
                trend_percentage = round(((latest_price.price - start_window_price.price) / start_window_price.price) * 100, 1)
            
            # Get average price for this time window
            avg_price_query = db.query(
                func.avg(PriceRecord.price).label("avg_price")
            ).filter(
                PriceRecord.commodity_id == commodity_id,
                PriceRecord.region_id == region.id,
                PriceRecord.recorded_at >= start_date
            ).scalar()
            
            avg_price = round(avg_price_query) if avg_price_query else latest_price.price
            
            regional_prices.append({
                "regionId": region.id,
                "price": latest_price.price,
                "avgPrice": avg_price,
                "trend": trend_percentage
            })
    
    return {"prices": regional_prices}


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