"""seed_commodities_and_regions

Revision ID: 83c623dc6903
Revises: 6bec24d04fc9
Create Date: 2025-04-15 15:04:50.635267

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Float, Boolean, Text


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
        column('min_price', Integer),
        column('max_price', Integer),
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
    
    # Insert commodities
    op.bulk_insert(
        commodity,
        [
            {
                "name": "Rice (Fine)",
                "bengali_name": "চাল (উন্নত মানের)",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 72,
                "max_price": 82,
                "description": "High-quality fine-grain rice varieties such as Chinigura and Kataribhog",
                "image_url": "/images/commodities/rice-fine.jpg",
                "is_active": True
            },
            {
                "name": "Rice (Medium)",
                "bengali_name": "চাল পাইজাম/লটা",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 60,
                "max_price": 68,
                "description": "Medium quality rice varieties including Paijam",
                "image_url": "/images/commodities/rice-medium.jpg",
                "is_active": True
            },
            {
                "name": "Rice (Coarse)",
                "bengali_name": "চাল মোটা",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 55,
                "max_price": 62,
                "description": "Coarse rice varieties commonly used in everyday meals",
                "image_url": "/images/commodities/rice-coarse.jpg",
                "is_active": True
            },
            {
                "name": "Wheat Flour (Fine)",
                "bengali_name": "আটা ময়দা",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 48,
                "max_price": 54,
                "description": "Fine wheat flour used for making breads and pastries",
                "image_url": "/images/commodities/wheat-flour.jpg",
                "is_active": True
            },
            {
                "name": "Wheat Flour (Medium)",
                "bengali_name": "আটা সুজি",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 53,
                "max_price": 60,
                "description": "Medium wheat flour used for various food preparations",
                "image_url": "/images/commodities/wheat-medium.jpg",
                "is_active": True
            },
            {
                "name": "Lentils (Masoor)",
                "bengali_name": "মসুর ডাল",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 105,
                "max_price": 115,
                "description": "Red lentils commonly used in Bengali cuisine",
                "image_url": "/images/commodities/lentils-masoor.jpg",
                "is_active": True
            },
            {
                "name": "Lentils (Mung)",
                "bengali_name": "মুগ ডাল",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 140,
                "max_price": 150,
                "description": "Green lentils used in various Bengali dishes",
                "image_url": "/images/commodities/lentils-mung.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Local)",
                "bengali_name": "পেঁয়াজ দেশি",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 75,
                "max_price": 95,
                "description": "Locally grown onions from Bangladesh",
                "image_url": "/images/commodities/onion-local.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Imported)",
                "bengali_name": "পেঁয়াজ আমদানি",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 70,
                "max_price": 80,
                "description": "Imported onions primarily from India",
                "image_url": "/images/commodities/onion-imported.jpg",
                "is_active": True
            },
            {
                "name": "Potato",
                "bengali_name": "আলু",
                "category": "agriculture",
                "unit": "kg",
                "min_price": 30,
                "max_price": 40,
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
                "name": "Dhaka",
                "bengali_name": "ঢাকা",
                "latitude": 23.8103,
                "longitude": 90.4125,
                "is_division": True
            },
            {
                "name": "Chittagong",
                "bengali_name": "চট্টগ্রাম",
                "latitude": 22.3569,
                "longitude": 91.7832,
                "is_division": True
            },
            {
                "name": "Rajshahi",
                "bengali_name": "রাজশাহী",
                "latitude": 24.3745,
                "longitude": 88.6042,
                "is_division": True
            },
            {
                "name": "Khulna",
                "bengali_name": "খুলনা",
                "latitude": 22.8456,
                "longitude": 89.5403,
                "is_division": True
            },
            {
                "name": "Barisal",
                "bengali_name": "বরিশাল",
                "latitude": 22.7010,
                "longitude": 90.3535,
                "is_division": True
            },
            {
                "name": "Sylhet",
                "bengali_name": "সিলেট",
                "latitude": 24.8949,
                "longitude": 91.8687,
                "is_division": True
            },
            {
                "name": "Rangpur",
                "bengali_name": "রংপুর",
                "latitude": 25.7439,
                "longitude": 89.2752,
                "is_division": True
            },
            {
                "name": "Mymensingh",
                "bengali_name": "ময়মনসিংহ",
                "latitude": 24.7471,
                "longitude": 90.4203,
                "is_division": True
            }
        ]
    )


def downgrade() -> None:
    op.execute("DELETE FROM region")
    op.execute("DELETE FROM commodity") 