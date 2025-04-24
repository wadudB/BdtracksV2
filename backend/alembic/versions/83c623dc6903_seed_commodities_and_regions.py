"""seed_commodities_and_regions

Revision ID: 83c623dc6903
Revises: 6bec24d04fc9
Create Date: 2025-04-15 15:04:50.635267

"""
from typing import Sequence, Union
from datetime import datetime, timedelta
import random

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Float, Boolean, Text, Date


# revision identifiers, used by Alembic.
revision: str = '83c623dc6903'
down_revision: Union[str, None] = '6bec24d04fc9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # First, let's check if bengali_name and image_url columns exist in commodity table
    # If not, add them
    try:
        op.add_column('commodity', sa.Column('bengali_name', sa.String(100), nullable=True))
        op.add_column('commodity', sa.Column('image_url', sa.String(255), nullable=True))
    except Exception:
        # Columns may already exist, continue
        pass
    
    # Define tables for bulk insert
    commodity = table(
        'commodity',
        column('id', Integer),
        column('name', String),
        column('bengali_name', String),
        column('category', String),
        column('unit', String),
        column('description', Text),
        column('image_url', String),
        column('is_active', Boolean),
    )
    
    region = table(
        'region',
        column('id', Integer),
        column('name', String),
        column('bengali_name', String),
        column('latitude', Float),
        column('longitude', Float),
        column('is_division', Boolean),
    )
    
    price_record = table(
        'pricerecord',
        column('commodity_id', Integer),
        column('region_id', Integer),
        column('price', Integer),
        column('source', String),
        column('notes', Text),
        column('recorded_at', Date),
    )
    
    # Insert commodities
    op.bulk_insert(
        commodity,
        [
            {
                "name": "Rice (Fine)",
                "bengali_name": "চাল (উন্নত মানের)",
                "category": "agriculture",
                "unit": "kg",
                "description": "High-quality fine-grain rice varieties such as Chinigura and Kataribhog",
                "image_url": "/images/commodities/rice-fine.jpg",
                "is_active": True
            },
            {
                "name": "Rice (Medium)",
                "bengali_name": "চাল পাইজাম/লটা",
                "category": "agriculture",
                "unit": "kg",
                "description": "Medium quality rice varieties including Paijam",
                "image_url": "/images/commodities/rice-medium.jpg",
                "is_active": True
            },
            {
                "name": "Rice (Coarse)",
                "bengali_name": "চাল মোটা",
                "category": "agriculture",
                "unit": "kg",
                "description": "Coarse rice varieties commonly used in everyday meals",
                "image_url": "/images/commodities/rice-coarse.jpg",
                "is_active": True
            },
            {
                "name": "Wheat Flour (Fine)",
                "bengali_name": "আটা ময়দা",
                "category": "agriculture",
                "unit": "kg",
                "description": "Fine wheat flour used for making breads and pastries",
                "image_url": "/images/commodities/wheat-flour.jpg",
                "is_active": True
            },
            {
                "name": "Wheat Flour (Medium)",
                "bengali_name": "আটা সুজি",
                "category": "agriculture",
                "unit": "kg",
                "description": "Medium wheat flour used for various food preparations",
                "image_url": "/images/commodities/wheat-medium.jpg",
                "is_active": True
            },
            {
                "name": "Lentils (Masoor)",
                "bengali_name": "মসুর ডাল",
                "category": "agriculture",
                "unit": "kg",
                "description": "Red lentils commonly used in Bengali cuisine",
                "image_url": "/images/commodities/lentils-masoor.jpg",
                "is_active": True
            },
            {
                "name": "Lentils (Mung)",
                "bengali_name": "মুগ ডাল",
                "category": "agriculture",
                "unit": "kg",
                "description": "Green lentils used in various Bengali dishes",
                "image_url": "/images/commodities/lentils-mung.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Local)",
                "bengali_name": "পেঁয়াজ দেশি",
                "category": "agriculture",
                "unit": "kg",
                "description": "Locally grown onions from Bangladesh",
                "image_url": "/images/commodities/onion-local.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Imported)",
                "bengali_name": "পেঁয়াজ আমদানি",
                "category": "agriculture",
                "unit": "kg",
                "description": "Imported onions primarily from India",
                "image_url": "/images/commodities/onion-imported.jpg",
                "is_active": True
            },
            {
                "name": "Potato",
                "bengali_name": "আলু",
                "category": "agriculture",
                "unit": "kg",
                "description": "Locally grown potatoes",
                "image_url": "/images/commodities/potato.jpg",
                "is_active": True
            }
        ]
    )
    
    # Insert regions
    op.bulk_insert(
        region,
        [
            {
                "id": 1,
                "name": "Dhaka",
                "bengali_name": "ঢাকা",
                "latitude": 23.9535742,
                "longitude": 90.14949879999999,
                "is_division": True
            },
            {
                "id": 2,
                "name": "Chittagong",
                "bengali_name": "চট্টগ্রাম",
                "latitude": 23.1793157,
                "longitude": 91.9881527,
                "is_division": True
            },
            {
                "id": 3,
                "name": "Rajshahi",
                "bengali_name": "রাজশাহী",
                "latitude": 24.7105776,
                "longitude": 88.94138650000001,
                "is_division": True
            },
            {
                "id": 4,
                "name": "Khulna",
                "bengali_name": "খুলনা",
                "latitude": 22.8087816,
                "longitude": 89.24671909999999,
                "is_division": True
            },
            {
                "id": 5,
                "name": "Barisal",
                "bengali_name": "বরিশাল",
                "latitude": 22.3811131,
                "longitude": 90.3371889,
                "is_division": True
            },
            {
                "id": 6,
                "name": "Sylhet",
                "bengali_name": "সিলেট",
                "latitude": 24.7049811,
                "longitude": 91.67606909999999,
                "is_division": True
            },
            {
                "id": 7,
                "name": "Rangpur",
                "bengali_name": "রংপুর",
                "latitude": 25.8483388,
                "longitude": 88.94138650000001,
                "is_division": True
            },
            {
                "id": 8,
                "name": "Mymensingh",
                "bengali_name": "ময়মনসিংহ",
                "latitude": 24.71362,
                "longitude": 90.4502368,
                "is_division": True
            }
        ]
    )
    
    # Create price records for each commodity in each region
    # Define base price ranges for each commodity
    price_ranges = {
        1: (72, 82),    # Rice (Fine)
        2: (60, 68),    # Rice (Medium)
        3: (55, 62),    # Rice (Coarse) 
        4: (48, 54),    # Wheat Flour (Fine)
        5: (53, 60),    # Wheat Flour (Medium)
        6: (105, 115),  # Lentils (Masoor)
        7: (140, 150),  # Lentils (Mung)
        8: (75, 95),    # Onion (Local)
        9: (70, 80),    # Onion (Imported)
        10: (30, 40)    # Potato
    }
    
    # Define price trends for different commodities over time
    # Some will have increasing trends, some decreasing, some stable with fluctuations
    trend_factors = {
        1: 1.10,  # Rice (Fine) - moderate increase over time (10%)
        2: 1.08,  # Rice (Medium) - slight increase (8%)
        3: 1.05,  # Rice (Coarse) - minimal increase (5%)
        4: 1.15,  # Wheat Flour (Fine) - significant increase (15%)
        5: 1.12,  # Wheat Flour (Medium) - moderate increase (12%)
        6: 0.95,  # Lentils (Masoor) - slight decrease (5% down)
        7: 1.02,  # Lentils (Mung) - stable with slight increase (2%)
        8: 1.25,  # Onion (Local) - volatile with large increase (25%)
        9: 1.20,  # Onion (Imported) - significant increase (20%)
        10: 0.90  # Potato - decrease over time (10% down)
    }
    
    # Regional factors for price variations
    region_factors = {
        1: 1.10,  # Dhaka - 10% more expensive (capital city)
        2: 1.05,  # Chittagong - 5% more expensive (major port city)
        3: 0.90,  # Rajshahi - 10% cheaper (agricultural region)
        4: 0.95,  # Khulna - 5% cheaper
        5: 0.97,  # Barisal - 3% cheaper
        6: 1.03,  # Sylhet - 3% more expensive
        7: 0.92,  # Rangpur - 8% cheaper (agricultural region)
        8: 1.00   # Mymensingh - neutral
    }
    
    # Seasonal variations (approximate)
    month_factors = {
        1: 1.02,   # January
        2: 1.01,   # February
        3: 1.00,   # March
        4: 0.99,   # April
        5: 0.98,   # May
        6: 0.99,   # June
        7: 1.01,   # July
        8: 1.03,   # August
        9: 1.05,   # September
        10: 1.04,  # October
        11: 1.02,  # November
        12: 1.01   # December
    }
    
    today = datetime.now().date()
    price_records = []
    
    # Generate 3 years of data
    start_date = today - timedelta(days=3*365)
    
    # For each commodity and region
    for commodity_id, (base_min, base_max) in price_ranges.items():
        for region_id in range(1, 9):  # 8 regions
            # Frequency of records
            # Weekly for the last 30 days (for weekly changes)
            # Twice a month for the last year (for monthly changes)
            # Monthly for the last 3 years (for yearly changes)
            
            # Start with monthly data (last 3 years)
            current_date = start_date
            while current_date <= today:
                # Determine how frequently to record data based on how recent it is
                if current_date >= (today - timedelta(days=30)):
                    # Weekly data for the last 30 days
                    interval_days = 7
                elif current_date >= (today - timedelta(days=365)):
                    # Bi-weekly data for the last year
                    interval_days = 15
                else:
                    # Monthly data for older records
                    interval_days = 30
                
                # Calculate price based on various factors
                # 1. Base price range
                # 2. Time trend (prices generally increase over time)
                # 3. Regional variation
                # 4. Seasonal factors
                # 5. Random fluctuations
                
                # Calculate time factor (increasing trend over time)
                days_from_start = (current_date - start_date).days
                total_days = (today - start_date).days
                time_progress = days_from_start / total_days if total_days > 0 else 0
                
                # Apply the trend for this commodity (interpolate between 1.0 and the trend factor)
                trend = 1.0 + (time_progress * (trend_factors[commodity_id] - 1.0))
                
                # Apply region factor
                region_factor = region_factors[region_id]
                
                # Apply seasonal factor
                month_factor = month_factors[current_date.month]
                
                # Random fluctuation factor (±3%)
                random_factor = 1.0 + (random.uniform(-0.03, 0.03))
                
                # Calculate the base price for this record
                base_price = (base_min + base_max) / 2
                
                # Apply all factors to get the final price
                price = int(base_price * trend * region_factor * month_factor * random_factor)
                
                # Add some weekly fluctuations for the last 30 days
                if current_date >= (today - timedelta(days=30)):
                    # Add a small weekly trend (±2%)
                    weekly_factor = 1.0 + (random.uniform(-0.02, 0.02))
                    price = int(price * weekly_factor)
                
                # Create the price record
                price_records.append({
                    "commodity_id": commodity_id,
                    "region_id": region_id,
                    "price": price,
                    "source": "Market Survey",
                    "notes": "Historical price data",
                    "recorded_at": current_date
                })
                
                # Move to the next date based on the interval
                current_date += timedelta(days=interval_days)
                
                # Add some additional data points with small variations for the last 30 days
                # This provides better granularity for weekly analysis
                if current_date >= (today - timedelta(days=30)) and current_date <= today:
                    # Add 1-2 extra data points between weekly intervals
                    for extra_days in [2, 5]:
                        extra_date = current_date - timedelta(days=interval_days - extra_days)
                        if extra_date <= today:
                            # Small variation from the calculated price (±2%)
                            extra_factor = 1.0 + (random.uniform(-0.02, 0.02))
                            extra_price = int(price * extra_factor)
                            
                            price_records.append({
                                "commodity_id": commodity_id,
                                "region_id": region_id,
                                "price": extra_price,
                                "source": "Market Survey",
                                "notes": "Additional price point",
                                "recorded_at": extra_date
                            })
    
    # Insert price records
    op.bulk_insert(price_record, price_records)


def downgrade() -> None:
    op.execute("DELETE FROM pricerecord")
    op.execute("DELETE FROM region")
    op.execute("DELETE FROM commodity")