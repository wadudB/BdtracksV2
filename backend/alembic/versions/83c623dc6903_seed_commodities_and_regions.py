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
    
    # Insert commodities
    op.bulk_insert(
        commodity,
        [
            {
                "name": "Fine Rice (Nazir/Miniket)",
                "bengali_name": "চাল সরু (নাজির/মিনিকেট)",
                "category": "agriculture",
                "unit": "kg",
                "description": "Fine quality rice varieties such as Nazir or Miniket",
                "image_url": "/images/commodities/rice-fine.jpg",
                "is_active": True
            },
            {
                "name": "Medium Rice (Paijam/Atash)",
                "bengali_name": "চাল (মাঝারী)পাইজাম/আটাশ",
                "category": "agriculture",
                "unit": "kg",
                "description": "Medium quality rice varieties including Paijam/Atash",
                "image_url": "/images/commodities/rice-medium.jpg",
                "is_active": True
            },
            {
                "name": "Medium Rice (Paijam/Lota)",
                "bengali_name": "চাল (মাঝারী)পাইজাম/লতা",
                "category": "agriculture",
                "unit": "kg",
                "description": "Medium quality rice varieties including Paijam/Lota",
                "image_url": "/images/commodities/rice-medium.jpg",
                "is_active": True
            },
            {
                "name": "Coarse Rice (Swarna/China Iri)",
                "bengali_name": "চাল (মোটা)/স্বর্ণা/চায়না ইরি",
                "category": "agriculture",
                "unit": "kg",
                "description": "Coarse rice varieties such as Swarna or China Iri",
                "image_url": "/images/commodities/rice-coarse.jpg",
                "is_active": True
            },
            {
                "name": "White Flour (Loose)",
                "bengali_name": "আটা সাদা (খোলা)",
                "category": "agriculture",
                "unit": "kg",
                "description": "White flour sold loose",
                "image_url": "/images/commodities/white-flour.jpg",
                "is_active": True
            },
            {
                "name": "Flour (Packet)",
                "bengali_name": "আটা (প্যাকেট)",
                "category": "agriculture",
                "unit": "kg",
                "description": "Packaged flour",
                "image_url": "/images/commodities/packaged-flour.jpg",
                "is_active": True
            },
            {
                "name": "Maida (Loose)",
                "bengali_name": "ময়দা (খোলা)",
                "category": "agriculture",
                "unit": "kg",
                "description": "Fine wheat flour sold loose",
                "image_url": "/images/commodities/maida.jpg",
                "is_active": True
            },
            {
                "name": "Maida (Packet)",
                "bengali_name": "ময়দা (প্যাকেট)",
                "category": "agriculture",
                "unit": "kg",
                "description": "Packaged fine wheat flour",
                "image_url": "/images/commodities/maida-packet.jpg",
                "is_active": True
            },
            {
                "name": "Soybean Oil (Loose)",
                "bengali_name": "সয়াবিন তেল (লুজ)",
                "category": "oil",
                "unit": "liter",
                "description": "Soybean oil sold loose",
                "image_url": "/images/commodities/soybean-oil.jpg",
                "is_active": True
            },
            {
                "name": "Soybean Oil (Bottled)",
                "bengali_name": "সয়াবিন তেল (বোতল)",
                "category": "oil",
                "unit": "liter",
                "description": "Bottled soybean oil",
                "image_url": "/images/commodities/soybean-oil-bottled.jpg",
                "is_active": True
            },
            {
                "name": "Palm Oil (Loose)",
                "bengali_name": "পাম অয়েল (লুজ)",
                "category": "oil",
                "unit": "liter",
                "description": "Palm oil sold loose",
                "image_url": "/images/commodities/palm-oil.jpg",
                "is_active": True
            },
            {
                "name": "Super Palm Oil (Loose)",
                "bengali_name": "সুপার পাম অয়েল (লুজ)",
                "category": "oil",
                "unit": "liter",
                "description": "Premium quality palm oil sold loose",
                "image_url": "/images/commodities/super-palm-oil.jpg",
                "is_active": True
            },
            {
                "name": "Rice Bran Oil (Bottled)",
                "bengali_name": "রাইস ব্রান তেল (বোতল)",
                "category": "oil",
                "unit": "liter",
                "description": "Bottled rice bran oil",
                "image_url": "/images/commodities/rice-bran-oil.jpg",
                "is_active": True
            },
            {
                "name": "Palm Olein (Bottled)",
                "bengali_name": "পাম অলিন (বোতল)",
                "category": "oil",
                "unit": "liter",
                "description": "Bottled palm olein oil",
                "image_url": "/images/commodities/palm-olein.jpg",
                "is_active": True
            },
            {
                "name": "Masoor Dal (Large Grain)",
                "bengali_name": "মশুর ডাল (বড় দানা)",
                "category": "pulses",
                "unit": "kg",
                "description": "Large grain red lentils",
                "image_url": "/images/commodities/masoor-large.jpg",
                "is_active": True
            },
            {
                "name": "Masoor Dal (Medium Grain)",
                "bengali_name": "মশূর ডাল (মাঝারী দানা)",
                "category": "pulses",
                "unit": "kg",
                "description": "Medium grain red lentils",
                "image_url": "/images/commodities/masoor-medium.jpg",
                "is_active": True
            },
            {
                "name": "Masoor Dal (Small Grain)",
                "bengali_name": "মশুর ডাল (ছোট দানা)",
                "category": "pulses",
                "unit": "kg",
                "description": "Small grain red lentils",
                "image_url": "/images/commodities/masoor-small.jpg",
                "is_active": True
            },
            {
                "name": "Moong Dal (Varies by Quality)",
                "bengali_name": "মুগ ডাল (মানভেদে)",
                "category": "pulses",
                "unit": "kg",
                "description": "Green lentils with varying quality",
                "image_url": "/images/commodities/moong-dal.jpg",
                "is_active": True
            },
            {
                "name": "Anchor Dal",
                "bengali_name": "এ্যাংকর ডাল",
                "category": "pulses",
                "unit": "kg",
                "description": "Anchor dal variety",
                "image_url": "/images/commodities/anchor-dal.jpg",
                "is_active": True
            },
            {
                "name": "Chickpea (Varies by Quality)",
                "bengali_name": "ছোলা (মানভেদে)",
                "category": "pulses",
                "unit": "kg",
                "description": "Chickpeas of varying qualities",
                "image_url": "/images/commodities/chickpea.jpg",
                "is_active": True
            },
            {
                "name": "Potato (Varies by Quality)",
                "bengali_name": "আলু (মানভেদে)",
                "category": "vegetables",
                "unit": "kg",
                "description": "Potatoes of varying qualities",
                "image_url": "/images/commodities/potato.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Local)",
                "bengali_name": "পিঁয়াজ (দেশী)",
                "category": "vegetables",
                "unit": "kg",
                "description": "Locally grown onions",
                "image_url": "/images/commodities/onion-local.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Imported)",
                "bengali_name": "পিঁয়াজ (আমদানি)",
                "category": "vegetables",
                "unit": "kg",
                "description": "Imported onions",
                "image_url": "/images/commodities/onion-imported.jpg",
                "is_active": True
            },
            {
                "name": "Garlic (Local)",
                "bengali_name": "রসুন (দেশী)",
                "category": "vegetables",
                "unit": "kg",
                "description": "Locally grown garlic",
                "image_url": "/images/commodities/garlic-local.jpg",
                "is_active": True
            },
            {
                "name": "Garlic (Imported)",
                "bengali_name": "রসুন (আমদানি)",
                "category": "vegetables",
                "unit": "kg",
                "description": "Imported garlic",
                "image_url": "/images/commodities/garlic-imported.jpg",
                "is_active": True
            },
            {
                "name": "Dry Chili (Local)",
                "bengali_name": "শুকনা মরিচ (দেশী)",
                "category": "spices",
                "unit": "kg",
                "description": "Locally grown dried chilies",
                "image_url": "/images/commodities/chili-dry-local.jpg",
                "is_active": True
            },
            {
                "name": "Dry Chili (Imported)",
                "bengali_name": "শুকনা মরিচ (আমদানি)",
                "category": "spices",
                "unit": "kg",
                "description": "Imported dried chilies",
                "image_url": "/images/commodities/chili-dry-imported.jpg",
                "is_active": True
            },
            {
                "name": "Turmeric (Local)",
                "bengali_name": "হলুদ (দেশী)",
                "category": "spices",
                "unit": "kg",
                "description": "Locally grown turmeric",
                "image_url": "/images/commodities/turmeric-local.jpg",
                "is_active": True
            },
            {
                "name": "Turmeric (Imported)",
                "bengali_name": "হলুদ (আমদানি)",
                "category": "spices",
                "unit": "kg",
                "description": "Imported turmeric",
                "image_url": "/images/commodities/turmeric-imported.jpg",
                "is_active": True
            },
            {
                "name": "Ginger (Local)",
                "bengali_name": "আদা (দেশী)",
                "category": "spices",
                "unit": "kg",
                "description": "Locally grown ginger",
                "image_url": "/images/commodities/ginger-local.jpg",
                "is_active": True
            },
            {
                "name": "Ginger (Imported)",
                "bengali_name": "আদা (আমদানি)",
                "category": "spices",
                "unit": "kg",
                "description": "Imported ginger",
                "image_url": "/images/commodities/ginger-imported.jpg",
                "is_active": True
            },
            {
                "name": "Cumin",
                "bengali_name": "জিরা",
                "category": "spices",
                "unit": "kg",
                "description": "Cumin seeds",
                "image_url": "/images/commodities/cumin.jpg",
                "is_active": True
            },
            {
                "name": "Cinnamon",
                "bengali_name": "দারুচিনি",
                "category": "spices",
                "unit": "kg",
                "description": "Cinnamon sticks",
                "image_url": "/images/commodities/cinnamon.jpg",
                "is_active": True
            },
            {
                "name": "Clove",
                "bengali_name": "লবঙ্গ",
                "category": "spices",
                "unit": "kg",
                "description": "Cloves spice",
                "image_url": "/images/commodities/clove.jpg",
                "is_active": True
            },
            {
                "name": "Cardamom (Small)",
                "bengali_name": "এলাচ(ছোট)",
                "category": "spices",
                "unit": "kg",
                "description": "Small cardamom pods",
                "image_url": "/images/commodities/cardamom-small.jpg",
                "is_active": True
            },
            {
                "name": "Coriander",
                "bengali_name": "ধনে",
                "category": "spices",
                "unit": "kg",
                "description": "Coriander seeds",
                "image_url": "/images/commodities/coriander.jpg",
                "is_active": True
            },
            {
                "name": "Bay Leaf",
                "bengali_name": "তেজপাতা",
                "category": "spices",
                "unit": "kg",
                "description": "Dried bay leaves",
                "image_url": "/images/commodities/bay-leaf.jpg",
                "is_active": True
            },
            {
                "name": "Rui Fish",
                "bengali_name": "রুই",
                "category": "fish",
                "unit": "kg",
                "description": "Freshwater rui fish",
                "image_url": "/images/commodities/rui-fish.jpg",
                "is_active": True
            },
            {
                "name": "Hilsa Fish",
                "bengali_name": "ইলিশ",
                "category": "fish",
                "unit": "kg",
                "description": "Hilsa fish, national fish of Bangladesh",
                "image_url": "/images/commodities/hilsa-fish.jpg",
                "is_active": True
            },
            {
                "name": "Beef",
                "bengali_name": "গরু",
                "category": "meat",
                "unit": "kg",
                "description": "Beef meat",
                "image_url": "/images/commodities/beef.jpg",
                "is_active": True
            },
            {
                "name": "Mutton",
                "bengali_name": "খাসী",
                "category": "meat",
                "unit": "kg",
                "description": "Mutton meat",
                "image_url": "/images/commodities/mutton.jpg",
                "is_active": True
            },
            {
                "name": "Broiler Chicken",
                "bengali_name": "মুরগী(ব্রয়লার)",
                "category": "meat",
                "unit": "kg",
                "description": "Farm-raised broiler chicken",
                "image_url": "/images/commodities/broiler-chicken.jpg",
                "is_active": True
            },
            {
                "name": "Local Chicken",
                "bengali_name": "মুরগী (দেশী)",
                "category": "meat",
                "unit": "kg",
                "description": "Local free-range chicken",
                "image_url": "/images/commodities/local-chicken.jpg",
                "is_active": True
            },
            {
                "name": "Powdered Milk (Packet)",
                "bengali_name": "গুড়া দুধ(প্যাকেটজাত)",
                "category": "dairy",
                "unit": "kg",
                "description": "Packaged powdered milk",
                "image_url": "/images/commodities/powdered-milk.jpg",
                "is_active": True
            },
            {
                "name": "Dano Milk Powder",
                "bengali_name": "ডানো",
                "category": "dairy",
                "unit": "kg",
                "description": "Dano brand milk powder",
                "image_url": "/images/commodities/dano-milk.jpg",
                "is_active": True
            },
            {
                "name": "Diploma Milk Powder (NZ)",
                "bengali_name": "ডিপ্লোমা (নিউজিল্যান্ড)",
                "category": "dairy",
                "unit": "kg",
                "description": "Diploma brand milk powder from New Zealand",
                "image_url": "/images/commodities/diploma-milk.jpg",
                "is_active": True
            },
            {
                "name": "Fresh Milk Powder",
                "bengali_name": "ফ্রেশ",
                "category": "dairy",
                "unit": "kg",
                "description": "Fresh brand milk powder",
                "image_url": "/images/commodities/fresh-milk.jpg",
                "is_active": True
            },
            {
                "name": "Marks Milk Powder",
                "bengali_name": "মার্কস",
                "category": "dairy",
                "unit": "kg",
                "description": "Marks brand milk powder",
                "image_url": "/images/commodities/marks-milk.jpg",
                "is_active": True
            },
            {
                "name": "Sugar",
                "bengali_name": "চিনি",
                "category": "grocery",
                "unit": "kg",
                "description": "White sugar",
                "image_url": "/images/commodities/sugar.jpg",
                "is_active": True
            },
            {
                "name": "Dates (Ordinary Quality)",
                "bengali_name": "খেজুর(সাধারণ মানের)",
                "category": "fruits",
                "unit": "kg",
                "description": "Ordinary quality dates",
                "image_url": "/images/commodities/dates.jpg",
                "is_active": True
            },
            {
                "name": "Iodized Salt (Packet)",
                "bengali_name": "লবণ(প্যাঃ)আয়োডিনযুক্ত",
                "category": "grocery",
                "unit": "kg",
                "description": "Packaged iodized salt",
                "image_url": "/images/commodities/iodized-salt.jpg",
                "is_active": True
            },
            {
                "name": "Egg (Farm)",
                "bengali_name": "ডিম (ফার্ম)",
                "category": "poultry",
                "unit": "dozen",
                "description": "Farm-produced eggs",
                "image_url": "/images/commodities/farm-eggs.jpg",
                "is_active": True
            },
            {
                "name": "Writing Paper (White)",
                "bengali_name": "লেখার কাগজ(সাদা)",
                "category": "stationery",
                "unit": "ream",
                "description": "White writing paper",
                "image_url": "/images/commodities/writing-paper.jpg",
                "is_active": True
            },
            {
                "name": "MS Rod (60 Grade)",
                "bengali_name": "এম,এস রড (৬০ গ্রেড)",
                "category": "construction",
                "unit": "kg",
                "description": "60 grade mild steel rod for construction",
                "image_url": "/images/commodities/ms-rod-60.jpg",
                "is_active": True
            },
            {
                "name": "MS Rod (40 Grade)",
                "bengali_name": "এম,এস রড( ৪০ গ্রেড)",
                "category": "construction",
                "unit": "kg",
                "description": "40 grade mild steel rod for construction",
                "image_url": "/images/commodities/ms-rod-40.jpg",
                "is_active": True
            },
            # Additional entries
            {
                "name": "Super Palm Oil (Loose)",
                "bengali_name": "পাম অয়েল (সুপার)",
                "category": "oil",
                "unit": "liter",
                "description": "Premium quality super palm oil sold loose",
                "image_url": "/images/commodities/super-palm-oil-alt.jpg",
                "is_active": True
            },
            {
                "name": "Potato (Varies by Quality)",
                "bengali_name": "আলু (নতুন, মানভেদে)",
                "category": "vegetables",
                "unit": "kg",
                "description": "New potatoes of varying qualities",
                "image_url": "/images/commodities/potato-new.jpg",
                "is_active": True
            },
            {
                "name": "Potato (Varies by Quality)",
                "bengali_name": "আলু (নতুন/পুরাতন)(মানভেদে)",
                "category": "vegetables",
                "unit": "kg",
                "description": "New/old potatoes of varying qualities",
                "image_url": "/images/commodities/potato-mixed.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Local)",
                "bengali_name": "পিঁয়াজ (নতুন) (দেশী)",
                "category": "vegetables",
                "unit": "kg",
                "description": "New locally grown onions",
                "image_url": "/images/commodities/onion-local-new.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Local)",
                "bengali_name": "পিঁয়াজ (নতুন/পুরাতন) (দেশী)",
                "category": "vegetables",
                "unit": "kg",
                "description": "New/old locally grown onions",
                "image_url": "/images/commodities/onion-local-mixed.jpg",
                "is_active": True
            },
            {
                "name": "Onion (Local)",
                "bengali_name": "পিঁয়াজ (দেশী)নতুন/পুরতান",
                "category": "vegetables",
                "unit": "kg",
                "description": "New/old locally grown onions",
                "image_url": "/images/commodities/onion-local-mixed.jpg",
                "is_active": True
            },
            {
                "name": "Garlic (Local)",
                "bengali_name": "রসুন (দেশী) ",
                "category": "vegetables",
                "unit": "kg",
                "description": "Locally grown garlic (with extra space)",
                "image_url": "/images/commodities/garlic-local.jpg",
                "is_active": True
            },
            {
                "name": "Garlic (Local)",
                "bengali_name": "রসুন (দেশী) নতুন/পুরাতন",
                "category": "vegetables",
                "unit": "kg",
                "description": "New/old locally grown garlic",
                "image_url": "/images/commodities/garlic-local-mixed.jpg",
                "is_active": True
            },
            {
                "name": "Garlic (Local)",
                "bengali_name": "Garlic (Local)/পুরাতন",
                "category": "vegetables",
                "unit": "kg",
                "description": "Old locally grown garlic",
                "image_url": "/images/commodities/garlic-local-old.jpg",
                "is_active": True
            },
            {
                "name": "Garlic (Local)",
                "bengali_name": "রসুন(দেশী) নতুন",
                "category": "vegetables",
                "unit": "kg",
                "description": "New locally grown garlic",
                "image_url": "/images/commodities/garlic-local-new.jpg",
                "is_active": True
            },
            {
                "name": "Ginger (Local)",
                "bengali_name": "আদা (দেশী)(নতুন)",
                "category": "spices",
                "unit": "kg",
                "description": "New locally grown ginger",
                "image_url": "/images/commodities/ginger-local-new.jpg",
                "is_active": True
            },
            {
                "name": "Iodized Salt (Packet)",
                "bengali_name": "লবণ(প্যাঃ)আয়োডিনযুক্ত(মানভেদে)",
                "category": "grocery",
                "unit": "kg",
                "description": "Packaged iodized salt of varying quality",
                "image_url": "/images/commodities/iodized-salt-varies.jpg",
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

def downgrade() -> None:
    op.execute("DELETE FROM pricerecord")
    op.execute("DELETE FROM region")
    op.execute("DELETE FROM commodity")