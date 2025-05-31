from typing import Optional
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationUpdate


class CRUDLocation(CRUDBase[Location, LocationCreate, LocationUpdate]):
    def get_by_place_id(self, db: Session, *, place_id: str) -> Optional[Location]:
        """Get a location by its Google Maps place_id"""
        return db.query(self.model).filter(self.model.place_id == place_id).first()
    
    def get_by_poi_id(self, db: Session, *, poi_id: str) -> Optional[Location]:
        """Get a location by its Google Maps POI ID"""
        return db.query(self.model).filter(self.model.poi_id == poi_id).first()
    
    def get_by_coordinates(
        self, db: Session, *, latitude: float, longitude: float, tolerance: float = 0.0001
    ) -> Optional[Location]:
        """
        Get a location by its coordinates with a small tolerance
        
        Args:
            latitude: The latitude to search for
            longitude: The longitude to search for
            tolerance: The tolerance range (default is about 10 meters)
        """
        return (
            db.query(self.model)
            .filter(
                self.model.latitude.between(latitude - tolerance, latitude + tolerance),
                self.model.longitude.between(longitude - tolerance, longitude + tolerance)
            )
            .first()
        )
    
    def get_or_create(
        self, db: Session, *, obj_in: LocationCreate
    ) -> Location:
        """
        Get an existing location or create a new one if it doesn't exist
        
        First tries to find by place_id if provided, then by coordinates
        """
        location = None
        
        # Try to find by place_id first
        if obj_in.place_id:
            location = self.get_by_place_id(db, place_id=obj_in.place_id)
            if location:
                return location
        
        # Try to find by poi_id next
        if obj_in.poi_id:
            location = self.get_by_poi_id(db, poi_id=obj_in.poi_id)
            if location:
                return location
        
        # Try to find by coordinates with a small tolerance
        if obj_in.latitude and obj_in.longitude:
            location = self.get_by_coordinates(
                db, latitude=obj_in.latitude, longitude=obj_in.longitude
            )
            if location:
                return location
        
        # No existing location found, create a new one
        return self.create(db, obj_in=obj_in)


location = CRUDLocation(Location) 