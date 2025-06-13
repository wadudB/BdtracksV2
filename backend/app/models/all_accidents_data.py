from sqlalchemy import String, Integer, DateTime, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func

from app.db.base_class import Base


class AllAccidentsData(Base):
    """Model for storing individual accident records with detailed information"""
    
    # Override the tablename to match what's in the database
    @declared_attr.directive
    @classmethod
    def __tablename__(cls) -> str:
        return "all_accidents_data"
    
    # Primary key using u_id to match the existing MySQL schema
    u_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, index=True)
    
    # News and identification fields
    news_category: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    id: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Accident occurrence data
    number_of_accidents_occured: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_the_accident_data_yearly_monthly_or_daily: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    day_of_the_week_of_the_accident: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Location fields
    exact_location_of_accident: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    area_of_accident: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    division_of_accident: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    district_of_accident: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    subdistrict_or_upazila_of_accident: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_place_of_accident_highway_or_expressway_or_water_or_others: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_country_bangladesh_or_other_country: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Accident details
    accident_type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    total_number_of_people_killed: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    total_number_of_people_injured: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reason_or_cause_for_accident: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Vehicle information
    primary_vehicle_involved: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    secondary_vehicle_involved: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tertiary_vehicle_involved: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    any_more_vehicles_involved: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Additional data
    available_ages_of_the_deceased: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # DateTime fields
    accident_datetime_from_url: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    accident_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Source and content fields
    url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    accident_id_number_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    contents_whole_gpt_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    articles_text_from_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    article_title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    headline: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Duplicate check flag
    duplicate_check: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    def __repr__(self) -> str:
        return f"<AllAccidentsData(u_id={self.u_id}, accident_type={self.accident_type}, district={self.district_of_accident})>" 