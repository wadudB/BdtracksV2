from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.models.commodity import Commodity
from app.models.region import Region
import logging
from sqlalchemy import text

logger = logging.getLogger(__name__)

# List of commodities from the frontend data
COMMODITIES = [
    {
        "name": "Rice (Fine)",
        "bengali_name": "চাল (উন্নত মানের)",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 72,
        "max_price": 82,
        "description": "High-quality fine-grain rice varieties such as Chinigura and Kataribhog",
        "image_url": "/images/commodities/rice-fine.jpg"
    },
    {
        "name": "Rice (Medium)",
        "bengali_name": "চাল পাইজাম/লটা",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 60,
        "max_price": 68,
        "description": "Medium quality rice varieties including Paijam",
        "image_url": "/images/commodities/rice-medium.jpg"
    },
    {
        "name": "Rice (Coarse)",
        "bengali_name": "চাল মোটা",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 55,
        "max_price": 62,
        "description": "Coarse rice varieties commonly used in everyday meals",
        "image_url": "/images/commodities/rice-coarse.jpg"
    },
    {
        "name": "Wheat Flour (Fine)",
        "bengali_name": "আটা ময়দা",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 48,
        "max_price": 54,
        "description": "Fine wheat flour used for making breads and pastries",
        "image_url": "/images/commodities/wheat-flour.jpg"
    },
    {
        "name": "Wheat Flour (Medium)",
        "bengali_name": "আটা সুজি",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 53,
        "max_price": 60,
        "description": "Medium wheat flour used for various food preparations",
        "image_url": "/images/commodities/wheat-medium.jpg"
    },
    {
        "name": "Lentils (Masoor)",
        "bengali_name": "মসুর ডাল",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 105,
        "max_price": 115,
        "description": "Red lentils commonly used in Bengali cuisine",
        "image_url": "/images/commodities/lentils-masoor.jpg"
    },
    {
        "name": "Lentils (Mung)",
        "bengali_name": "মুগ ডাল",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 140,
        "max_price": 150,
        "description": "Green lentils used in various Bengali dishes",
        "image_url": "/images/commodities/lentils-mung.jpg"
    },
    {
        "name": "Onion (Local)",
        "bengali_name": "পেঁয়াজ দেশি",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 75,
        "max_price": 95,
        "description": "Locally grown onions from Bangladesh",
        "image_url": "/images/commodities/onion-local.jpg"
    },
    {
        "name": "Onion (Imported)",
        "bengali_name": "পেঁয়াজ আমদানি",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 70,
        "max_price": 80,
        "description": "Imported onions primarily from India",
        "image_url": "/images/commodities/onion-imported.jpg"
    },
    {
        "name": "Potato",
        "bengali_name": "আলু",
        "category": "agriculture",
        "unit": "kg",
        "min_price": 30,
        "max_price": 40,
        "description": "Locally grown potatoes",
        "image_url": "/images/commodities/potato.jpg"
    }
]

# List of Bangladesh regions
REGIONS = [
    {
        "name": "Dhaka",
        "bengali_name": "ঢাকা",
        "latitude": 23.9535742,
        "longitude": 90.14949879999999,
        "is_division": True
    },
    {
        "name": "Chittagong",
        "bengali_name": "চট্টগ্রাম",
        "latitude": 23.1793157,
        "longitude": 91.9881527,
        "is_division": True
    },
    {
        "name": "Rajshahi",
        "bengali_name": "রাজশাহী",
        "latitude": 24.7105776,
        "longitude": 88.94138650000001,
        "is_division": True
    },
    {
        "name": "Khulna",
        "bengali_name": "খুলনা",
        "latitude": 22.8087816,
        "longitude": 89.24671909999999,
        "is_division": True
    },
    {
        "name": "Barisal",
        "bengali_name": "বরিশাল",
        "latitude": 22.3811131,
        "longitude": 90.3371889,
        "is_division": True
    },
    {
        "name": "Sylhet",
        "bengali_name": "সিলেট",
        "latitude": 24.7049811,
        "longitude": 91.67606909999999,
        "is_division": True
    },
    {
        "name": "Rangpur",
        "bengali_name": "রংপুর",
        "latitude": 25.8483388,
        "longitude": 88.94138650000001,
        "is_division": True
    },
    {
        "name": "Mymensingh",
        "bengali_name": "ময়মনসিংহ",
        "latitude": 24.71362,
        "longitude": 90.4502368,
        "is_division": True
    }
]

# Initialize database with seed data
def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Seed commodities
    for commodity_data in COMMODITIES:
        existing = db.query(Commodity).filter_by(name=commodity_data["name"]).first()
        if not existing:
            commodity_data["is_active"] = True  # Ensure is_active is set
            commodity = Commodity(**commodity_data)
            db.add(commodity)
            logger.info(f"Added commodity: {commodity_data['name']}")
    
    # Seed regions
    for region_data in REGIONS:
        existing = db.query(Region).filter_by(name=region_data["name"]).first()
        if not existing:
            region = Region(**region_data)
            db.add(region)
            logger.info(f"Added region: {region_data['name']}")
    
    db.commit()
    logger.info("Database initialization complete")


def drop_all_tables() -> None:
    """Helper function to completely reset the database by dropping all tables"""
    with engine.connect() as conn:
        # Drop foreign key checks to avoid constraint issues
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        
        # Drop all tables
        table_names = [
            "commodity", "region", "pricerecord", "supplychaindata", 
            "supplychainstage", "pricehistoryaggregated", "user", "alembic_version"
        ]
        
        for table in table_names:
            conn.execute(text(f"DROP TABLE IF EXISTS {table};"))
        
        # Re-enable foreign key checks
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
        
        conn.commit()
        
    logger.info("All tables dropped successfully") 