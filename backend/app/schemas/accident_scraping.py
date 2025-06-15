from typing import Optional, Dict, Any
from pydantic import BaseModel


class AccidentScrapingResponse(BaseModel):
    """Response schema for accident scraping endpoint"""
    message: str
    scraping_completed: bool
    summary: Optional[Dict[str, Any]] = None
    scraping_error: Optional[str] = None
    
    class Config:
        from_attributes = True


class AccidentSummaryData(BaseModel):
    """Schema for accident summary data"""
    daily_totals_last_30_days: Dict[str, float]
    monthly_totals: Dict[str, float]
    yearly_totals: Dict[str, float]
    yearly_injured_totals: Dict[str, float]
    yearly_accident_totals: Dict[str, float]
    most_frequent_locations_per_year: Dict[str, Optional[str]]
    yearly_vehicle_accident_count: Dict[str, Dict[str, int]]
    yearly_accidents_by_district: Dict[str, Dict[str, int]]
    
    class Config:
        from_attributes = True 