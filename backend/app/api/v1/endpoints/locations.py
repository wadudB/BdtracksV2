from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import Any, List, Optional
from datetime import date, datetime, timedelta

from app import schemas, crud
from app.db.session import get_db
from app.models.location import Location
from app.models.price_record import PriceRecord
from app.models.commodity import Commodity
from app.models.region import Region

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


@router.get("/with-prices")
def get_locations_with_prices(
    db: Session = Depends(get_db),
    lat: float = Query(..., description="Center latitude for search"),
    lng: float = Query(..., description="Center longitude for search"),
    radius_km: float = Query(50, description="Search radius in kilometers"),
    days: int = Query(30, description="Number of days to look back for price data"),
    category: Optional[str] = Query(None, description="Filter by commodity category (gas, grocery, restaurant)")
) -> Any:
    """
    Get locations with recent price data within a geographic range.
    Returns locations that have price records in the last N days.
    """
    # Calculate date range
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    # Calculate approximate lat/lng bounds for the radius
    # Rough approximation: 1 degree lat ≈ 111 km, 1 degree lng ≈ 111 km * cos(lat)
    import math
    lat_delta = radius_km / 111.0
    lng_delta = radius_km / (111.0 * abs(math.cos(math.radians(lat))))
    
    min_lat = lat - lat_delta
    max_lat = lat + lat_delta
    min_lng = lng - lng_delta
    max_lng = lng + lng_delta
    
    # Base query to get locations with recent price data
    query = db.query(
        Location.id,
        Location.name,
        Location.address,
        Location.latitude,
        Location.longitude,
        PriceRecord.price,
        PriceRecord.recorded_at,
        Commodity.name.label('commodity_name'),
        Commodity.category,
        Commodity.unit,
        Region.name.label('region_name')
    ).join(
        PriceRecord, Location.id == PriceRecord.location_id
    ).join(
        Commodity, PriceRecord.commodity_id == Commodity.id
    ).join(
        Region, PriceRecord.region_id == Region.id
    ).filter(
        and_(
            Location.latitude >= min_lat,
            Location.latitude <= max_lat,
            Location.longitude >= min_lng,
            Location.longitude <= max_lng,
            PriceRecord.recorded_at >= start_date,
            PriceRecord.recorded_at <= end_date
        )
    )
    
    # Apply category filter if specified
    if category:
        if category == "gas":
            query = query.filter(Commodity.category == "energy")
        elif category == "grocery":
            query = query.filter(or_(
                Commodity.category == "agriculture",
                Commodity.category == "consumer"
            ))
        elif category == "restaurant":
            # For restaurants, we might want to show food-related commodities
            query = query.filter(Commodity.category == "agriculture")
    
    # Get the most recent price for each location-commodity combination
    subquery = query.order_by(
        Location.id,
        Commodity.id,
        PriceRecord.recorded_at.desc()
    ).subquery()
    
    # Group results by location
    results = db.query(subquery).all()
    
    # Process results to group by location and get latest price for each commodity
    locations_dict = {}
    for row in results:
        location_id = row.id
        if location_id not in locations_dict:
            # Determine category based on most common commodity type at this location
            locations_dict[location_id] = {
                "id": location_id,
                "name": row.name,
                "address": row.address or "",
                "lat": float(row.latitude),
                "lng": float(row.longitude),
                "commodities": {},
                "region_name": row.region_name,
                "category_counts": {}
            }
        
        # Track commodity categories for determining location type
        if row.category not in locations_dict[location_id]["category_counts"]:
            locations_dict[location_id]["category_counts"][row.category] = 0
        locations_dict[location_id]["category_counts"][row.category] += 1
        
        # Keep only the latest price for each commodity at this location
        commodity_key = f"{row.commodity_name}_{row.unit}"
        if commodity_key not in locations_dict[location_id]["commodities"]:
            locations_dict[location_id]["commodities"][commodity_key] = {
                "commodity": row.commodity_name,
                "price": row.price,
                "unit": row.unit,
                "recorded_at": row.recorded_at,
                "category": row.category
            }
        else:
            # Keep the more recent price
            if row.recorded_at > locations_dict[location_id]["commodities"][commodity_key]["recorded_at"]:
                locations_dict[location_id]["commodities"][commodity_key] = {
                    "commodity": row.commodity_name,
                    "price": row.price,
                    "unit": row.unit,
                    "recorded_at": row.recorded_at,
                    "category": row.category
                }
    
    # Convert to list and determine location category
    locations_list = []
    for location_data in locations_dict.values():
        # Determine location category based on most common commodity category
        if location_data["category_counts"]:
            most_common_category = max(location_data["category_counts"], key=location_data["category_counts"].get)
            if most_common_category == "energy":
                display_category = "gas"
            elif most_common_category in ["oil", "agriculture", "pulses", "grocery", "dairy", "spices"]:
                display_category = "grocery"
            elif most_common_category in ["fruits", "vegetables"]:
                display_category = "restaurant"  # Fresh produce markets
            else:
                display_category = "grocery"
        else:
            display_category = "grocery"
        
        # Convert commodities dict to list and sort by price
        commodities_list = list(location_data["commodities"].values())
        commodities_list.sort(key=lambda x: x["price"])
        
        # Format the commodities for frontend
        formatted_commodities = []
        for commodity in commodities_list:
            formatted_commodities.append({
                "name": commodity["commodity"],
                "price": commodity["price"],
                "unit": commodity["unit"],
                "recorded_at": commodity["recorded_at"].isoformat(),
                "category": commodity["category"]
            })
        
        location_item = {
            "id": location_data["id"],
            "name": location_data["name"],
            "address": location_data["address"],
            "category": display_category,
            "lat": location_data["lat"],
            "lng": location_data["lng"],
            "commodities": formatted_commodities,
            "region_name": location_data["region_name"]
        }
        
        # Add summary info for backward compatibility
        if formatted_commodities:
            avg_price = sum(c["price"] for c in formatted_commodities) / len(formatted_commodities)
            location_item["price"] = round(avg_price, 2)
            location_item["originalPrice"] = round(avg_price * 1.1, 2)
            location_item["discount"] = "10%"
        else:
            location_item["price"] = 0
            location_item["originalPrice"] = 0
            location_item["discount"] = "0%"
        
        locations_list.append(location_item)
    
    return {"locations": locations_list, "total": len(locations_list)}


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