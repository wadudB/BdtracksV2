from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
from typing import Any, List, Optional
from datetime import datetime, timedelta
import time
import logging

from app import schemas, crud
from app.models.price_record import PriceRecord
from app.models.region import Region
from app.db.session import get_db

router = APIRouter()

# Set up logger
logger = logging.getLogger("commodities_api")


@router.get("/", response_model=List[schemas.Commodity])
def read_commodities(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
) -> Any:
    """
    Retrieve commodities that have price records.
    """
    total_start_time = time.time()
    
    # Define time ranges for calculations
    today = datetime.now().date()
    thirty_days_ago = today - timedelta(days=30)
    one_week_ago = today - timedelta(days=7)
    two_weeks_ago = today - timedelta(days=14)
    
    commodity_model = crud.commodity.model
    query = db.query(
        commodity_model.id,
        commodity_model.name,
        commodity_model.bengali_name,
        commodity_model.category,
        commodity_model.unit,
        commodity_model.created_at,
        # Price calculations
        func.min(PriceRecord.price).label("min_price"),
        func.max(PriceRecord.price).label("max_price"),
        func.avg(PriceRecord.price).label("avg_price"),
        # Current week average using CASE
        func.avg(
            case(
                {
                    (PriceRecord.recorded_at >= one_week_ago): PriceRecord.price
                },
                else_=None
            )
        ).label("current_week_avg"),
        # Previous week average using CASE
        func.avg(
            case(
                {
                    and_(
                        PriceRecord.recorded_at >= two_weeks_ago,
                        PriceRecord.recorded_at < one_week_ago
                    ): PriceRecord.price
                },
                else_=None
            )
        ).label("previous_week_avg")
    ).join(
        PriceRecord, 
        commodity_model.id == PriceRecord.commodity_id
    ).filter(
        PriceRecord.recorded_at >= thirty_days_ago,
        PriceRecord.price > 0  # Exclude records with price of 0
    ).group_by(
        commodity_model.id,
        commodity_model.name,
        commodity_model.bengali_name,
        commodity_model.category,
        commodity_model.unit,
        commodity_model.created_at
    )
    
    # Apply category filter if provided
    if category:
        query = query.filter(commodity_model.category == category)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute the query
    results = query.all()
    
    # Process results
    commodities_list = []
    for row in results:
        commodity_dict = {
            "id": row.id,
            "name": row.name,
            "bengali_name": row.bengali_name,
            "category": row.category,
            "unit": row.unit,
            "created_at": row.created_at,
        }
        
        min_price = row.min_price
        max_price = row.max_price
        avg_price = row.avg_price
        current_week_avg = row.current_week_avg or 0
        previous_week_avg = row.previous_week_avg or current_week_avg or 0
        
        # Add price statistics
        if min_price is not None:
            commodity_dict["min_price"] = min_price
            commodity_dict["max_price"] = max_price
            commodity_dict["current_price"] = round(avg_price)
            
            # Calculate weekly change
            if previous_week_avg > 0:
                weekly_change = ((current_week_avg - previous_week_avg) / previous_week_avg) * 100
                commodity_dict["weekly_change"] = round(weekly_change, 1)
            else:
                commodity_dict["weekly_change"] = 0
        
        # Validate with Pydantic model
        validated_commodity = schemas.Commodity.model_validate(
            commodity_dict, 
            by_name=True
        )
        commodities_list.append(validated_commodity)
    
    return commodities_list


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
    
    # Convert to dict to add price data and other details
    commodity_dict = schemas.CommodityDetail.model_validate(commodity).model_dump()
    
    # Define time periods for calculations
    today = datetime.now().date()
    thirty_days_ago = today - timedelta(days=30)
    one_week_ago = today - timedelta(days=7)
    one_month_ago = today - timedelta(days=30)
    three_months_ago = today - timedelta(days=90)
    six_months_ago = today - timedelta(days=180)
    one_year_ago = today - timedelta(days=365)
    
    # Query for min, max, and average prices (last 30 days)
    price_data = db.query(
        func.min(PriceRecord.price).label("min_price"),
        func.max(PriceRecord.price).label("max_price"),
        func.avg(PriceRecord.price).label("avg_price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at >= thirty_days_ago
    ).first()
    
    # Add prices to the result if they exist
    if price_data and price_data.min_price is not None:
        commodity_dict["min_price"] = price_data.min_price
        commodity_dict["max_price"] = price_data.max_price
        commodity_dict["current_price"] = round(price_data.avg_price)
    
    # Calculate weekly change
    # Current average price (last 7 days)
    current_week_avg = db.query(
        func.avg(PriceRecord.price).label("avg_price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at >= one_week_ago
    ).scalar() or 0
    
    # Previous week average price (7-14 days ago)
    previous_week = one_week_ago - timedelta(days=7)
    previous_week_avg = db.query(
        func.avg(PriceRecord.price).label("avg_price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at >= previous_week,
        PriceRecord.recorded_at < one_week_ago
    ).scalar() or current_week_avg  # Fallback to current if no previous data
    
    # Calculate percent change
    if previous_week_avg > 0:
        weekly_change = ((current_week_avg - previous_week_avg) / previous_week_avg) * 100
        commodity_dict["weeklyChange"] = round(weekly_change, 1)
    else:
        commodity_dict["weeklyChange"] = 0
    
    # Calculate monthly change
    # Current average price (last 30 days)
    current_month_avg = db.query(
        func.avg(PriceRecord.price).label("avg_price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at >= one_month_ago
    ).scalar() or 0
    
    # Previous month average price (30-60 days ago)
    previous_month = one_month_ago - timedelta(days=30)
    previous_month_avg = db.query(
        func.avg(PriceRecord.price).label("avg_price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at >= previous_month,
        PriceRecord.recorded_at < one_month_ago
    ).scalar() or current_month_avg  # Fallback to current if no previous data
    
    # Calculate percent change
    if previous_month_avg > 0:
        monthly_change = ((current_month_avg - previous_month_avg) / previous_month_avg) * 100
        commodity_dict["monthlyChange"] = round(monthly_change, 1)
    else:
        commodity_dict["monthlyChange"] = 0
    
    # Calculate yearly change
    # Current average price (last 30 days)
    current_year_avg = current_month_avg  # Reuse the current month avg
    
    # Previous year average price (365-395 days ago)
    previous_year = one_year_ago - timedelta(days=30)
    previous_year_avg = db.query(
        func.avg(PriceRecord.price).label("avg_price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at >= previous_year,
        PriceRecord.recorded_at < one_year_ago
    ).scalar() or current_year_avg  # Fallback to current if no previous data
    
    # Calculate percent change
    if previous_year_avg > 0:
        yearly_change = ((current_year_avg - previous_year_avg) / previous_year_avg) * 100
        commodity_dict["yearlyChange"] = round(yearly_change, 1)
    else:
        commodity_dict["yearlyChange"] = 0
    
    # Get price history (last 3 years, aggregated appropriately)
    # For recent dates, get daily data
    # For older dates, aggregate to weekly or monthly averages to keep the size manageable
    
    # Last 30 days - daily
    recent_records = db.query(
        PriceRecord.recorded_at.label("date"),
        func.avg(PriceRecord.price).label("price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at >= thirty_days_ago
    ).group_by(
        PriceRecord.recorded_at
    ).order_by(
        PriceRecord.recorded_at
    ).all()
    
    # 30 days to 6 months - weekly averages
    weekly_records = db.query(
        # First day of the week (Sunday)
        func.subdate(
            func.date(PriceRecord.recorded_at), 
            func.weekday(func.date(PriceRecord.recorded_at))
        ).label("date"),
        func.avg(PriceRecord.price).label("price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at >= six_months_ago,
        PriceRecord.recorded_at < thirty_days_ago
    ).group_by(
        func.year(PriceRecord.recorded_at),
        func.week(PriceRecord.recorded_at)
    ).order_by(
        func.year(PriceRecord.recorded_at),
        func.week(PriceRecord.recorded_at)
    ).all()
    
    # 6 months to 3 years - monthly averages
    monthly_records = db.query(
        # First day of the month
        func.date_format(PriceRecord.recorded_at, '%Y-%m-01').label("date"),
        func.avg(PriceRecord.price).label("price")
    ).filter(
        PriceRecord.commodity_id == commodity.id,
        PriceRecord.recorded_at < six_months_ago
    ).group_by(
        func.year(PriceRecord.recorded_at),
        func.month(PriceRecord.recorded_at)
    ).order_by(
        func.year(PriceRecord.recorded_at),
        func.month(PriceRecord.recorded_at)
    ).all()
    
    # Combine all records and format them
    all_records = monthly_records + weekly_records + recent_records
    commodity_dict["price_history"] = [
        {"date": record.date.strftime("%Y-%m-%d") if hasattr(record.date, "strftime") else record.date, 
         "price": round(record.price)}
        for record in all_records
    ]
    
    # Get regional prices (latest for each region)
    regional_prices = []
    regions = db.query(Region).all()
    
    for region in regions:
        # Get latest price for this region
        latest_price = db.query(PriceRecord).filter(
            PriceRecord.commodity_id == commodity.id,
            PriceRecord.region_id == region.id
        ).order_by(
            PriceRecord.recorded_at.desc()
        ).first()
        
        if latest_price:
            # Get previous price for calculating change
            previous_price = db.query(PriceRecord).filter(
                PriceRecord.commodity_id == commodity.id,
                PriceRecord.region_id == region.id,
                PriceRecord.recorded_at < latest_price.recorded_at
            ).order_by(
                PriceRecord.recorded_at.desc()
            ).first()
            
            change = 0
            if previous_price:
                change = latest_price.price - previous_price.price
            
            regional_prices.append({
                "region": region.name,
                "price": latest_price.price,
                "change": change
            })
    
    commodity_dict["regional_prices"] = regional_prices
    
    return commodity_dict


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