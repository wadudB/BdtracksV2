from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Any, Dict, List, Optional
from datetime import datetime, timedelta
import statistics

from app import schemas, crud
from app.models.price_record import PriceRecord
from app.db.session import get_db

router = APIRouter()

@router.get("/{commodity_id}", response_model=Dict[str, Any])
def get_price_analysis(
    *,
    db: Session = Depends(get_db),
    commodity_id: int,
    timeframe: Optional[str] = "month"  # Can be "week", "month", "year", "all"
) -> Any:
    """
    Get detailed price analysis for a commodity including:
    - Price volatility
    - Price trends
    - Moving averages
    - Seasonal patterns (if available)
    - Min/max ranges
    """
    # Validate the commodity exists
    commodity = crud.commodity.get(db=db, id=commodity_id)
    if not commodity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Commodity not found",
        )
    
    # Determine date range based on timeframe
    now = datetime.now().date()
    if timeframe == "week":
        start_date = now - timedelta(days=7)
    elif timeframe == "month":
        start_date = now - timedelta(days=30)
    elif timeframe == "year":
        start_date = now - timedelta(days=365)
    else:  # "all"
        # Get the date of the oldest record
        oldest_record = db.query(PriceRecord).filter(
            PriceRecord.commodity_id == commodity_id
        ).order_by(PriceRecord.recorded_at).first()
        
        start_date = oldest_record.recorded_at if oldest_record else now - timedelta(days=365)
    
    # Get price records in the given timeframe
    price_records = db.query(PriceRecord).filter(
        PriceRecord.commodity_id == commodity_id,
        PriceRecord.recorded_at >= start_date
    ).order_by(PriceRecord.recorded_at).all()
    
    # Check if we have data to analyze
    if not price_records:
        return {
            "commodity_id": commodity_id,
            "timeframe": timeframe,
            "analysis": {
                "volatility": 0,
                "trend": "stable",
                "seasonal_pattern": None,
            },
            "price_data": [],
        }
    
    # Extract prices and dates for analysis
    prices = [record.price for record in price_records]
    dates = [record.recorded_at.isoformat() for record in price_records]
    
    # Basic statistics
    avg_price = sum(prices) / len(prices)
    min_price = min(prices)
    max_price = max(prices)
    
    # Calculate volatility (standard deviation / mean)
    # Higher volatility indicates more erratic price movements
    try:
        price_stddev = statistics.stdev(prices)
        volatility = round((price_stddev / avg_price) * 100, 2)
    except statistics.StatisticsError:
        volatility = 0
    
    # Calculate trend (simple linear regression)
    # Positive slope = rising trend, Negative slope = falling trend
    n = len(prices)
    if n > 1:
        indices = list(range(n))
        sum_x = sum(indices)
        sum_y = sum(prices)
        sum_xy = sum(i * p for i, p in zip(indices, prices))
        sum_xx = sum(i * i for i in indices)
        
        try:
            slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x)
            
            # Interpret the trend
            if slope > 5:
                trend = "strongly rising"
            elif slope > 1:
                trend = "rising"
            elif slope < -5:
                trend = "strongly falling"
            elif slope < -1:
                trend = "falling"
            else:
                trend = "stable"
        except ZeroDivisionError:
            trend = "stable"
    else:
        trend = "insufficient data"
    
    # Calculate moving averages (7-day)
    moving_avgs = []
    window_size = min(7, len(prices))
    
    for i in range(len(prices)):
        if i < window_size - 1:
            # Not enough data for a full window yet
            moving_avgs.append(None)
        else:
            window = prices[i-(window_size-1):i+1]
            moving_avgs.append(round(sum(window) / len(window)))
    
    # Calculate month-over-month changes
    monthly_changes = []
    for i, record in enumerate(price_records):
        current_date = record.recorded_at
        month_ago_date = current_date - timedelta(days=30)
        
        # Find the closest price record from a month ago
        month_ago_record = db.query(PriceRecord).filter(
            PriceRecord.commodity_id == commodity_id,
            PriceRecord.recorded_at <= month_ago_date
        ).order_by(desc(PriceRecord.recorded_at)).first()
        
        if month_ago_record:
            change_pct = ((record.price - month_ago_record.price) / month_ago_record.price) * 100
            monthly_changes.append(round(change_pct, 2))
        else:
            monthly_changes.append(None)
    
    # Format price data for the frontend
    price_data = []
    for i, record in enumerate(price_records):
        price_data.append({
            "date": record.recorded_at.isoformat(),
            "price": record.price,
            "movingAvg": moving_avgs[i],
            "monthlyChange": monthly_changes[i]
        })
    
    # Get min/max price from the commodity model if available
    min_max_data = {}
    try:
        # These may not exist in older models
        if hasattr(commodity, 'min_price') and commodity.min_price is not None:
            min_max_data["min_price"] = commodity.min_price
        
        if hasattr(commodity, 'max_price') and commodity.max_price is not None:
            min_max_data["max_price"] = commodity.max_price
    except:
        # If error, just continue without min/max
        pass
    
    return {
        "commodity_id": commodity_id,
        "commodity_name": commodity.name,
        "timeframe": timeframe,
        "analysis": {
            "average_price": round(avg_price),
            "min_price": min_price,
            "max_price": max_price,
            "volatility": volatility,
            "trend": trend,
            **min_max_data
        },
        "price_data": price_data,
    } 