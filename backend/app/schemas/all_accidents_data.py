from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from pydantic.alias_generators import to_camel


# Shared properties
class AllAccidentsDataBase(BaseModel):
    news_category: Optional[str] = None
    id: Optional[str] = None
    number_of_accidents_occured: Optional[str] = None
    is_the_accident_data_yearly_monthly_or_daily: Optional[str] = None
    day_of_the_week_of_the_accident: Optional[str] = None
    exact_location_of_accident: Optional[str] = None
    area_of_accident: Optional[str] = None
    division_of_accident: Optional[str] = None
    district_of_accident: Optional[str] = None
    subdistrict_or_upazila_of_accident: Optional[str] = None
    is_place_of_accident_highway_or_expressway_or_water_or_others: Optional[str] = None
    is_country_bangladesh_or_other_country: Optional[str] = None
    accident_type: Optional[str] = None
    total_number_of_people_killed: Optional[str] = None
    total_number_of_people_injured: Optional[str] = None
    reason_or_cause_for_accident: Optional[str] = None
    primary_vehicle_involved: Optional[str] = None
    secondary_vehicle_involved: Optional[str] = None
    tertiary_vehicle_involved: Optional[str] = None
    any_more_vehicles_involved: Optional[str] = None
    available_ages_of_the_deceased: Optional[str] = None
    accident_datetime_from_url: Optional[datetime] = None
    accident_date: Optional[datetime] = None
    url: Optional[str] = None
    source: Optional[str] = None
    accident_id_number_url: Optional[str] = None
    contents_whole_gpt_response: Optional[str] = None
    articles_text_from_url: Optional[str] = None
    article_title: Optional[str] = None
    headline: Optional[str] = None
    summary: Optional[str] = None
    duplicate_check: Optional[bool] = False


# Properties to receive on all accidents data creation
class AllAccidentsDataCreate(AllAccidentsDataBase):
    pass


# Properties to receive on all accidents data update
class AllAccidentsDataUpdate(BaseModel):
    news_category: Optional[str] = None
    id: Optional[str] = None
    number_of_accidents_occured: Optional[str] = None
    is_the_accident_data_yearly_monthly_or_daily: Optional[str] = None
    day_of_the_week_of_the_accident: Optional[str] = None
    exact_location_of_accident: Optional[str] = None
    area_of_accident: Optional[str] = None
    division_of_accident: Optional[str] = None
    district_of_accident: Optional[str] = None
    subdistrict_or_upazila_of_accident: Optional[str] = None
    is_place_of_accident_highway_or_expressway_or_water_or_others: Optional[str] = None
    is_country_bangladesh_or_other_country: Optional[str] = None
    accident_type: Optional[str] = None
    total_number_of_people_killed: Optional[str] = None
    total_number_of_people_injured: Optional[str] = None
    reason_or_cause_for_accident: Optional[str] = None
    primary_vehicle_involved: Optional[str] = None
    secondary_vehicle_involved: Optional[str] = None
    tertiary_vehicle_involved: Optional[str] = None
    any_more_vehicles_involved: Optional[str] = None
    available_ages_of_the_deceased: Optional[str] = None
    accident_datetime_from_url: Optional[datetime] = None
    accident_date: Optional[datetime] = None
    url: Optional[str] = None
    source: Optional[str] = None
    accident_id_number_url: Optional[str] = None
    contents_whole_gpt_response: Optional[str] = None
    articles_text_from_url: Optional[str] = None
    article_title: Optional[str] = None
    headline: Optional[str] = None
    summary: Optional[str] = None
    duplicate_check: Optional[bool] = None


# Properties shared by models stored in DB
class AllAccidentsDataInDBBase(AllAccidentsDataBase):
    u_id: int

    model_config = ConfigDict(
        from_attributes=True, alias_generator=to_camel, populate_by_name=True
    )


# Properties to return to client
class AllAccidentsData(AllAccidentsDataInDBBase):
    pass


# Properties stored in DB
class AllAccidentsDataInDB(AllAccidentsDataInDBBase):
    pass 