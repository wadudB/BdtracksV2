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
    category: Optional[str] = Query(
        None,
        description="Filter by commodity category or group (agriculture, oil, pulses, vegetables, spices, fish, meat, dairy, grocery, fruits, poultry, stationery, construction, food, energy, household)",
    ),
    skip: int = Query(0, description="Skip records for pagination"),
    limit: int = Query(100, description="Limit number of records returned"),
) -> Any:
    """
    Get locations with recent price data within a geographic range.
    Returns locations that have price records in the last N days.

    Categories can be individual database categories or grouped categories:
    - food: includes agriculture, pulses, vegetables, spices, fish, meat, dairy, grocery, fruits, poultry
    - energy: includes oil
    - household: includes stationery, construction
    """
    # Calculate date range
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)

    print(f"start_date: {start_date}, end_date: {end_date}")

    # Calculate approximate lat/lng bounds for the radius
    import math

    lat_delta = radius_km / 111.0
    lng_delta = radius_km / (111.0 * abs(math.cos(math.radians(lat))))

    min_lat = lat - lat_delta
    max_lat = lat + lat_delta
    min_lng = lng - lng_delta
    max_lng = lng + lng_delta

    location_query = (
        db.query(Location.id)
        .distinct()
        .join(PriceRecord, Location.id == PriceRecord.location_id)
        .filter(
            and_(
                Location.latitude >= min_lat,
                Location.latitude <= max_lat,
                Location.longitude >= min_lng,
                Location.longitude <= max_lng,
                PriceRecord.recorded_at >= start_date,
                PriceRecord.recorded_at <= end_date,
            )
        )
    )

    # Apply category filter if specified
    if category:
        location_query = location_query.join(
            Commodity, PriceRecord.commodity_id == Commodity.id
        )

        # Define category groups for filtering
        food_categories = [
            "agriculture",
            "pulses",
            "vegetables",
            "spices",
            "fish",
            "meat",
            "dairy",
            "grocery",
            "fruits",
            "poultry",
        ]
        energy_categories = ["oil"]
        household_categories = ["stationery", "construction"]

        # Check if it's a group category or individual category
        if category == "food":
            location_query = location_query.filter(
                Commodity.category.in_(food_categories)
            )
        elif category == "energy":
            location_query = location_query.filter(
                Commodity.category.in_(energy_categories)
            )
        elif category == "household":
            location_query = location_query.filter(
                Commodity.category.in_(household_categories)
            )
        # Individual category filtering
        elif category in food_categories + energy_categories + household_categories:
            location_query = location_query.filter(Commodity.category == category)

    # Get matching location IDs
    location_ids = [loc_id for (loc_id,) in location_query.all()]

    # If no locations found, return empty result
    if not location_ids:
        return {"locations": [], "total": 0}

    # Get the total count for pagination metadata
    total_count = len(location_ids)

    paginated_location_ids = location_ids[skip : skip + limit]

    ranked_prices = (
        db.query(
            PriceRecord.id,
            PriceRecord.location_id,
            PriceRecord.commodity_id,
            PriceRecord.price,
            PriceRecord.recorded_at,
            PriceRecord.region_id,
            func.row_number()
            .over(
                partition_by=[PriceRecord.location_id, PriceRecord.commodity_id],
                order_by=PriceRecord.recorded_at.desc(),
            )
            .label("rank"),
        )
        .filter(
            and_(
                PriceRecord.location_id.in_(paginated_location_ids),
                PriceRecord.recorded_at >= start_date,
                PriceRecord.recorded_at <= end_date,
            )
        )
        .subquery()
    )

    # Get only the latest price record for each location-commodity pair
    latest_prices = (
        db.query(
            Location.id,
            Location.name,
            Location.address,
            Location.latitude,
            Location.longitude,
            ranked_prices.c.price,
            ranked_prices.c.recorded_at,
            Commodity.name.label("commodity_name"),
            Commodity.category,
            Commodity.unit,
            Region.name.label("region_name"),
        )
        .join(ranked_prices, Location.id == ranked_prices.c.location_id)
        .join(Commodity, ranked_prices.c.commodity_id == Commodity.id)
        .join(Region, ranked_prices.c.region_id == Region.id)
        .filter(ranked_prices.c.rank == 1)
        .all()
    )

    # Process results to group by location
    locations_dict = {}
    for row in latest_prices:
        location_id = row.id
        if location_id not in locations_dict:
            locations_dict[location_id] = {
                "id": location_id,
                "name": row.name,
                "address": row.address or "",
                "lat": float(row.latitude),
                "lng": float(row.longitude),
                "commodities": [],
                "region_name": row.region_name,
                "category_counts": {},
            }

        # Track commodity categories for determining location type
        if row.category not in locations_dict[location_id]["category_counts"]:
            locations_dict[location_id]["category_counts"][row.category] = 0
        locations_dict[location_id]["category_counts"][row.category] += 1

        # Add this commodity price - only add if price > 0
        if row.price > 0:
            locations_dict[location_id]["commodities"].append(
                {
                    "name": row.commodity_name,
                    "price": row.price,
                    "unit": row.unit,
                    "recorded_at": row.recorded_at.isoformat(),
                    "category": row.category,
                }
            )

    # Convert to list and determine location category
    locations_list = []
    for location_data in locations_dict.values():
        # Skip locations with no commodity data
        if not location_data["commodities"]:
            continue

        # Group categories for display
        if location_data["category_counts"]:
            most_common_category = max(
                location_data["category_counts"],
                key=location_data["category_counts"].get,
            )

            # Define category groups for display
            food_categories = [
                "agriculture",
                "pulses",
                "vegetables",
                "spices",
                "fish",
                "meat",
                "dairy",
                "grocery",
                "fruits",
                "poultry",
            ]
            energy_categories = ["oil"]
            household_categories = ["stationery", "construction"]

            # Map to display categories
            if most_common_category in food_categories:
                display_category = "food"
            elif most_common_category in energy_categories:
                display_category = "energy"
            elif most_common_category in household_categories:
                display_category = "household"
            else:
                display_category = most_common_category
        else:
            display_category = "food"  # Default if no category is found

        # Sort commodities by latest recorded_at date in descending order (newest first)
        location_data["commodities"].sort(key=lambda x: x["recorded_at"], reverse=True)

        location_item = {
            "id": location_data["id"],
            "name": location_data["name"],
            "address": location_data["address"],
            "category": display_category,
            "lat": location_data["lat"],
            "lng": location_data["lng"],
            "commodities": location_data["commodities"],
            "region_name": location_data["region_name"],
        }

        # Add summary info for backward compatibility
        if location_data["commodities"]:
            avg_price = sum(c["price"] for c in location_data["commodities"]) / len(
                location_data["commodities"]
            )
            location_item["price"] = round(avg_price, 2)
            location_item["originalPrice"] = round(avg_price * 1.1, 2)
            location_item["discount"] = "10%"

        locations_list.append(location_item)

    return {
        "locations": locations_list,
        "total": total_count,
        "skip": skip,
        "limit": limit,
    }


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
