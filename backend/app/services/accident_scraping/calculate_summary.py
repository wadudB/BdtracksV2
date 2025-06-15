import collections
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings


class CalculateSummaryService:
    """Service for calculating accident summary statistics"""
    
    def get_summary(self, db: Session) -> Optional[Dict[str, Any]]:
        """Calculate and return accident summary data"""
        try:
            # Fetching data
            data = self.get_data(db)
            
            if not data:
                return None

            # Current date and date 30 days ago
            current_date = datetime.now()
            thirty_days_ago = current_date - timedelta(days=30)

            # Initialize dictionaries to store the totals
            daily_totals_last_30_days = collections.defaultdict(float)
            monthly_totals = collections.defaultdict(float)
            yearly_totals = collections.defaultdict(float)
            vehicle_accident_count = collections.defaultdict(int)
            yearly_vehicle_accident_count = collections.defaultdict(lambda: collections.Counter())

            # Initialize dictionaries to store the totals for injured
            daily_injured_totals_last_30_days = collections.defaultdict(float)
            monthly_injured_totals = collections.defaultdict(float)
            yearly_injured_totals = collections.defaultdict(float)
            yearly_accident_totals = collections.defaultdict(float)
            yearly_location_counts = collections.defaultdict(lambda: collections.Counter())
            yearly_accidents_by_district = collections.defaultdict(lambda: collections.defaultdict(int))

            for entry in data:
                # Extract the datetime of the accident
                accident_date = entry["accident_datetime_from_url"]
                year = accident_date.year
                month = accident_date.month
                day = accident_date.day

                # Convert accidents count to float
                accident_count = entry["number_of_accidents_occured"]
                if accident_count and str(accident_count).lower() != "unknown":
                    accident = float(accident_count)
                else:
                    accident = 0.0

                # Convert killed count to float
                killed_count = entry["total_number_of_people_killed"]
                if killed_count and str(killed_count).lower() != "unknown":
                    killed = float(killed_count)
                else:
                    killed = 0.0

                # Convert injured count to float
                injured_count = entry["total_number_of_people_injured"]
                if injured_count:
                    try:
                        injured = float(injured_count)
                    except ValueError:
                        if str(injured_count).lower() == "unknown":
                            injured = 0.0
                        else:
                            print(f"Skipping non-numeric value: {injured_count}")
                            injured = 0.0
                else:
                    injured = 0.0

                vehicles = [
                    entry["primary_vehicle_involved"],
                    entry["secondary_vehicle_involved"],
                    entry["tertiary_vehicle_involved"],
                ], entry["any_more_vehicles_involved"]

                # Check if the accident date is in the last 30 days of its year
                if accident_date.year == current_date.year:
                    # For the current year, consider the last 30 days from today
                    if accident_date >= thirty_days_ago:
                        daily_key = accident_date.strftime("%Y-%m-%d")
                        daily_totals_last_30_days[daily_key] += killed
                else:
                    # For previous years, check if it's within the last 30 days of the year
                    if self.is_last_30_days_of_year(accident_date):
                        daily_key = accident_date.strftime("%Y-%m-%d")
                        daily_totals_last_30_days[daily_key] += killed

                # Check if the accident date is in the last 30 days of its year
                if accident_date.year == current_date.year:
                    if accident_date >= thirty_days_ago:
                        daily_injured_key = accident_date.strftime("%Y-%m-%d")
                        daily_injured_totals_last_30_days[daily_injured_key] += injured
                else:
                    if self.is_last_30_days_of_year(accident_date):
                        daily_injured_key = accident_date.strftime("%Y-%m-%d")
                        daily_injured_totals_last_30_days[daily_injured_key] += injured

                # Aggregate the data for monthly and yearly totals
                yearly_accident_key = year
                yearly_accident_totals[yearly_accident_key] += accident

                monthly_key = (year, month)
                monthly_totals[monthly_key] += killed

                yearly_key = year
                yearly_totals[yearly_key] += killed

                monthly_injured_key = (year, month)
                monthly_injured_totals[monthly_injured_key] += injured

                yearly_injured_key = year
                yearly_injured_totals[yearly_injured_key] += injured

                district = entry["district_of_accident"]
                if district:
                    yearly_location_counts[year][district] += 1

                district_year = entry["accident_datetime_from_url"].year
                district_accident = entry["district_of_accident"]
                if district_accident and "cox" in district_accident.lower():
                    district_accident = "Cox's Bazar"
                elif district_accident and "cumilla" in district_accident.lower():
                    district_accident = "Comilla"
                if district_accident:
                    yearly_accidents_by_district[district_year][district_accident] += 1

                for vehicle in vehicles:
                    if vehicle and vehicle != "None":
                        if isinstance(vehicle, list):
                            for v in vehicle:
                                if v and v != "None":
                                    yearly_vehicle_accident_count[year][v] += 1
                        else:
                            yearly_vehicle_accident_count[year][vehicle] += 1

            # Find the most frequent accident location for each year
            most_frequent_locations_per_year = {
                year: locations.most_common(1)[0][0] if locations else None
                for year, locations in yearly_location_counts.items()
            }
            
            print("Most Frequent Accident Locations per Year:", most_frequent_locations_per_year)

            # Save the calculated data
            self.upsert_data(
                daily_totals_last_30_days,
                monthly_totals,
                yearly_totals,
                daily_injured_totals_last_30_days,
                monthly_injured_totals,
                yearly_injured_totals,
                yearly_accident_totals,
                most_frequent_locations_per_year,
                yearly_vehicle_accident_count,
                yearly_accidents_by_district,
                db,
            )
            
            # Return summary data
            return {
                "daily_totals_last_30_days": dict(daily_totals_last_30_days),
                "monthly_totals": {f"{k[0]}-{k[1]:02d}": v for k, v in monthly_totals.items()},
                "yearly_totals": dict(yearly_totals),
                "yearly_injured_totals": dict(yearly_injured_totals),
                "yearly_accident_totals": dict(yearly_accident_totals),
                "most_frequent_locations_per_year": most_frequent_locations_per_year,
                "yearly_vehicle_accident_count": {k: dict(v) for k, v in yearly_vehicle_accident_count.items()},
                "yearly_accidents_by_district": {k: dict(v) for k, v in yearly_accidents_by_district.items()}
            }
            
        except Exception as e:
            print(f"Error calculating summary: {e}")
            raise

    def get_data(self, db: Session) -> List[Dict[str, Any]]:
        """Get accident data from database using SQLAlchemy"""
        try:
            query = text("""
                SELECT
                    `number_of_accidents_occured`,
                    `total_number_of_people_killed`,
                    `total_number_of_people_injured`,
                    `district_of_accident`,
                    `accident_datetime_from_url`,
                    `primary_vehicle_involved`,
                    `secondary_vehicle_involved`,
                    `tertiary_vehicle_involved`,
                    `any_more_vehicles_involved`
                FROM `all_accidents_data` 
                WHERE `is_country_bangladesh_or_other_country` = "Bangladesh" 
                AND `is_the_accident_data_yearly_monthly_or_daily` = "daily"
                AND `duplicate_check` = 0
                ORDER BY `accident_datetime_from_url` DESC;
            """)
            
            result = db.execute(query)
            rows = result.fetchall()
            
            # Convert rows to dictionaries
            return [dict(row._mapping) for row in rows]
            
        except Exception as e:
            print(f"Error fetching data: {e}")
            return []

    @staticmethod
    def is_last_30_days_of_year(date: datetime) -> bool:
        """Check if the date is within the last 30 days of the year."""
        year_end = datetime(date.year, 12, 31)
        return (year_end - date).days < 30

    def upsert_data(
        self,
        daily_totals: Dict,
        monthly_totals: Dict,
        yearly_totals: Dict,
        daily_injured_totals: Dict,
        monthly_injured_totals: Dict,
        yearly_injured_totals: Dict,
        yearly_accident_totals: Dict,
        most_frequent_locations_per_year: Dict,
        yearly_vehicle_accident_count: Dict,
        yearly_accidents_by_district: Dict,
        db: Session,
    ):
        """Upsert calculated data to database using SQLAlchemy"""
        try:
            for year, total_killed in yearly_totals.items():
                # Prepare the daily deaths JSON, filtering entries by year
                daily_deaths_json = json.dumps(
                    {k: v for k, v in daily_totals.items() if k.startswith(str(year))}
                )
                
                # Prepare the daily injured JSON
                daily_injured_json = json.dumps(
                    {k: v for k, v in daily_injured_totals.items() if k.startswith(str(year))}
                )
                
                vehicles_involved_json = json.dumps(dict(yearly_vehicle_accident_count[year]))
                
                # Prepare the monthly deaths JSON
                monthly_deaths_json = json.dumps(
                    {f"{k[0]}-{k[1]:02d}": v for k, v in monthly_totals.items() if k[0] == year}
                )

                monthly_injured_json = json.dumps(
                    {
                        f"{k[0]}-{k[1]:02d}": v
                        for k, v in monthly_injured_totals.items()
                        if k[0] == year
                    }
                )

                accidents_by_district_json = json.dumps(
                    dict(yearly_accidents_by_district[year]), ensure_ascii=False
                )

                # Upsert the data into the database
                upsert_query = text("""
                    INSERT INTO accident_data_summary (year, date, total_killed, daily_deaths, 
                    monthly_deaths, total_injured, daily_injured, monthly_injured, last_updated, total_accidents, 
                    accident_hotspot, vehicles_involved, accidents_by_district)
                    VALUES (:year, :date, :total_killed, :daily_deaths, :monthly_deaths, :total_injured, 
                    :daily_injured, :monthly_injured, :last_updated, :total_accidents, :accident_hotspot, 
                    :vehicles_involved, :accidents_by_district)
                    ON DUPLICATE KEY UPDATE
                    daily_deaths = VALUES(daily_deaths),
                    monthly_deaths = VALUES(monthly_deaths),
                    total_killed = VALUES(total_killed),
                    daily_injured = VALUES(daily_injured),
                    monthly_injured = VALUES(monthly_injured),
                    total_injured = VALUES(total_injured),
                    last_updated = VALUES(last_updated),
                    total_accidents = VALUES(total_accidents),
                    accident_hotspot = VALUES(accident_hotspot),
                    vehicles_involved = VALUES(vehicles_involved),
                    accidents_by_district = VALUES(accidents_by_district)
                """)
                
                db.execute(upsert_query, {
                    'year': year,
                    'date': datetime.now().date(),
                    'total_killed': yearly_totals[year],
                    'daily_deaths': daily_deaths_json,
                    'monthly_deaths': monthly_deaths_json,
                    'total_injured': yearly_injured_totals[year],
                    'daily_injured': daily_injured_json,
                    'monthly_injured': monthly_injured_json,
                    'last_updated': datetime.now(),
                    'total_accidents': yearly_accident_totals[year],
                    'accident_hotspot': most_frequent_locations_per_year[year],
                    'vehicles_involved': vehicles_involved_json,
                    'accidents_by_district': accidents_by_district_json
                })

            db.commit()
            
        except Exception as e:
            db.rollback()
            print(f"Error upserting data: {e}")
            raise 