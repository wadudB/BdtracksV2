from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Any, Dict, List
from datetime import datetime, date
import pandas as pd
import time

from app import schemas, crud
from app.db.session import get_db
from app.schemas.price_record import PriceRecordCreate
from app.utils.scraper_utils import (
    scrape_excel_links, 
    download_excel_in_memory, 
    parse_excel, 
    filter_links_by_date
)

router = APIRouter()

# Commodity name mapping (same as in process_commodity_data.py)
COMMODITY_MAPPING = {
    "Fine Rice (Nazir/Miniket)": 1,
    "Medium Rice (Paijam/Atash)": 2,
    "Medium Rice (Paijam/Lota)": 3,
    "চাল (পাইজাম/লতা)": 3,
    "Coarse Rice (Swarna/China Iri)": 4,
    "White Flour (Loose)": 5,
    "Flour (Packet)": 6,
    "Maida (Loose)": 7,
    "Maida (Packet)": 8,
    "Soybean Oil (Loose)": 9,
    "Soybean Oil (Bottled)": 10,
    "Palm Oil (Loose)": 11,
    "Super Palm Oil (Loose)": 12,
    "Rice Bran Oil (Bottled)": 13,
    "Palm Olein (Bottled)": 14,
    "Masoor Dal (Large Grain)": 15,
    "মশূর ডাল (বড় দানা)": 15,
    "Masoor Dal (Medium Grain)": 16,
    "Masoor Dal (Small Grain)": 17,
    "Moong Dal (Varies by Quality)": 18,
    "Anchor Dal": 19,
    "Chickpea (Varies by Quality)": 20,
    "Potato (Varies by Quality)": 21,
    "Onion (Local)": 22,
    "Onion (Imported)": 23,
    "Garlic (Local)": 24,
    "Garlic (Imported)": 25,
    "Dry Chili (Local)": 26,
    "Dry Chili (Imported)": 27,
    "শুকনা মরিচ (আম)": 27,
    "Turmeric (Local)": 28,
    "Turmeric (Imported)": 29,
    "Ginger (Local)": 30,
    "Ginger (Imported)": 31,
    "Cumin": 32,
    "Cinnamon": 33,
    "Clove": 34,
    "Cardamom (Small)": 35,
    "Coriander": 36,
    "Bay Leaf": 37,
    "Rui Fish": 38,
    "Hilsa Fish": 39,
    "Beef": 40,
    "Mutton": 41,
    "Broiler Chicken": 42,
    "Local Chicken": 43,
    "Powdered Milk (Packet)": 44,
    "Dano Milk Powder": 45,
    "Diploma Milk Powder (NZ)": 46,
    "Fresh Milk Powder": 47,
    "Marks Milk Powder": 48,
    "Sugar": 49,
    "Dates (Ordinary Quality)": 50,
    "Iodized Salt (Packet)": 51,
    "Egg (Farm)": 52,
    "Writing Paper (White)": 53,
    "MS Rod (60 Grade)": 54,
    "MS Rod (40 Grade)": 55,
    # Duplicates with different IDs
    "Super Palm Oil (Loose)": 56,
    "Potato (Varies by Quality)": 57,
    "Potato (Varies by Quality)": 58,
    "Onion (Local)": 59,
    "Onion (Local)": 60,
    "Onion (Local)": 61,
    "Garlic (Local)": 62,
    "Garlic (Local)": 63,
    "রসুন(দেশী) নতুন/পুরাতন)": 63,
    "Garlic (Local)": 64,
    "রসুন(দেশী) পুরাতন": 64,
    "Garlic (Local)": 65,
    "Ginger (Local)": 66,
    "আদা (দেশী) নতুন": 66,
    "Iodized Salt (Packet)": 67,
    "গরু (গোস্ত)": 40,
}

# Bazar name to place_id mapping (same as in process_commodity_data.py)
BAZAR_PLACE_IDS = {
    "Karwan Bazar": "ChIJJ_p5P5i4VTcRL7w40HP92u0",
    "কাওরান বাজার (খুচরা ও পাইকারী)": "ChIJJ_p5P5i4VTcRL7w40HP92u0",
    "Mohammadpur Town Hall Bazar": "ChIJ7-AQnle_VTcRJ2oN-bAlc2s",
    "Kachukhet Bazar": "ChIJB1GCFTnHVTcRVO-Nw81exv4",
    "Malibag": "ChIJmTj5xGK4VTcRVWaIFCvjgsI",
    "মালিবাগ বাজার": "ChIJmTj5xGK4VTcRVWaIFCvjgsI",
    "Hatirpool": "ChIJX8y6Jr25VTcR2c7y0gL7Gf0",
    "Rampura Bazar": "ChIJK_f3mui5VTcR-HDJfI6lRoY",
    "রামপুরা বাজার": "ChIJK_f3mui5VTcR-HDJfI6lRoY",
    "Katasur Raw Bazar": "ChIJk0mBQ2W_VTcRFzqcmEx_7MY",
    "কাটাসুর কাঁচা বাজার।": "ChIJk0mBQ2W_VTcRFzqcmEx_7MY",
    "কাটাসুর কাঁচা বাজার": "ChIJk0mBQ2W_VTcRFzqcmEx_7MY",
    "New Market": "ChIJVVltZNu5VTcRDoS-IiSqsas",
    "মহাখালী বাজার": "ChIJVVVVVXDHVTcRRcFo68PKts8",
    "মীরপুর-১ নং (খুচরা ও পাইকারী) বাজার": "ChIJZ_nGUe_AVTcRgqiOa2OVluA",
    "মীরপুর-১ নং (পাইকারী) বাজার  ও বাদামতলী বাজার": "ChIJZ_nGUe_AVTcRgqiOa2OVluA",
    "মীরপুর-১ নং (খুচরা ও পাইকারী) বাজার  ও বাদামতলী বাজার": "ChIJZ_nGUe_AVTcRgqiOa2OVluA",
    "বাদামতলী বাজার": "ChIJ9RspLIG5VTcREGlWZJ-vIAo",
    "সূত্রাপুর বাজার": "ChIJj087iaW5VTcRLoK6KoWTkM4",
    "শ্যাম বাজার": "ChIJ6RSEorS5VTcRsU1V2lmn67I",
    "মৌলভী বাজার পাইকারী বাজার": "ChIJvQGIBOK4VTcRspPgfCWuOhU",
    "যাত্রাবাড়ী (খুচরা ও পাইকারী) বাজার": "ChIJ2ex_HCy5VTcRtmL8L8eZ7OU",
    "যাত্রাবাড়ী (খুচরা ও পাইকারী) বাজার": "ChIJ2ex_HCy5VTcRtmL8L8eZ7OU"
}

# Bazars to skip
skip_bazars = ["রহমতগঞ্জ", "উত্তরা আজম পুর বাজার", "শাহজাহানপুর"]
class ScrapingStatus:
    """Class to track scraping status"""
    def __init__(self):
        self.is_running = False
        self.progress = 0
        self.current_step = ""
        self.total_files = 0
        self.processed_files = 0
        self.records_created = 0
        self.errors = []
        self.start_time = None

# Global status instance
scraping_status = ScrapingStatus()

def get_latest_tcb_date(db: Session) -> date:
    """Get the latest TCB record date from database"""
    from sqlalchemy import text
    try:
        query = text("""
            SELECT MAX(recorded_at) as latest_date 
            FROM pricerecord 
            WHERE source = 'TCB'
        """)
        result = db.execute(query).fetchone()
        return result.latest_date if result and result.latest_date else None
    except Exception as e:
        print(f"Error querying database: {e}")
        return None

def convert_scraped_data_to_records(scraped_data: List[Dict], db: Session) -> List[PriceRecordCreate]:
    """Convert scraped data to database records"""
    records = []
    
    for item in scraped_data:
        commodity_name = item.get('commodity_name', '')
        
        # Get commodity ID
        commodity_id = COMMODITY_MAPPING.get(commodity_name)
        if not commodity_id:
            continue
            
        # Parse date
        date_str = item.get('date', '').split()[0]
        try:
            recorded_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            continue
            
        # Get prices
        min_price = item.get('commodity_price_lowest')
        max_price = item.get('commodity_price_highest')
        
        if not min_price and not max_price:
            continue
            
        try:
            min_price = int(float(min_price)) if min_price else None
            max_price = int(float(max_price)) if max_price else None
        except (ValueError, TypeError):
            continue

        district = item.get('location_district')
        source = item.get('source', '')
        unit = item.get('unit', '')
        
            
        # Process bazars
        bazars_str = item.get('exact_bazar_name', '')
        if bazars_str:
            bazars = [b.strip() for b in bazars_str.split(',')]
            
            for bazar in bazars:
                # Skip specified bazars
                if bazar in skip_bazars:
                    continue

                if bazar in BAZAR_PLACE_IDS:
                    place_id = BAZAR_PLACE_IDS[bazar]
                    
                    # Create records for min and max prices
                    if min_price is not None:
                        min_record = PriceRecordCreate(
                            commodity_id=commodity_id,
                            region_id=1,
                            price=min_price,
                            recorded_by=None,
                            source='TCB',
                            source_url=source,
                            notes=f"Lowest price. Unit: {unit}",
                            location_id=0,
                            recorded_at=recorded_date,
                            location={
                                "name": bazar,
                                "address": f"{bazar}, {district}",
                                "latitude": 0,
                                "longitude": 0,
                                "place_id": place_id,
                                "poi_id": ""
                            }
                        )
                        records.append(min_record)
                    
                    if max_price is not None:
                        max_record = PriceRecordCreate(
                            commodity_id=commodity_id,
                            region_id=1,
                            price=max_price,
                            recorded_by=None,
                            source='TCB',
                            source_url=source,
                            notes=f"Highest price. Unit: {unit}",
                            location_id=0,
                            recorded_at=recorded_date,
                            location={
                                "name": bazar,
                                "address": f"{bazar}, {district}",
                                "latitude": 0,
                                "longitude": 0,
                                "place_id": place_id,
                                "poi_id": ""
                            }
                        )
                        records.append(max_record)
    
    return records

@router.get("/status")
def get_scraping_status() -> Dict[str, Any]:
    """Get current scraping status"""
    return {
        "is_running": scraping_status.is_running,
        "progress": scraping_status.progress,
        "current_step": scraping_status.current_step,
        "total_files": scraping_status.total_files,
        "processed_files": scraping_status.processed_files,
        "records_created": scraping_status.records_created,
        "errors": scraping_status.errors[-10:],  # Last 10 errors
        "start_time": scraping_status.start_time,
        "duration": (datetime.now() - scraping_status.start_time).total_seconds() if scraping_status.start_time else None
    }

@router.post("/start")
def start_tcb_scraping(
    background_tasks: BackgroundTasks,
    force_full_scrape: bool = False,
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """Start TCB commodity price scraping process"""
    
    if scraping_status.is_running:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Scraping is already in progress"
        )
    
    # Reset status
    scraping_status.is_running = True
    scraping_status.progress = 0
    scraping_status.current_step = "Starting..."
    scraping_status.errors = []
    scraping_status.start_time = datetime.now()
    scraping_status.records_created = 0
    
    # Start background task
    background_tasks.add_task(
        run_scraping_process, 
        force_full_scrape=force_full_scrape
    )
    
    return {"message": "TCB scraping started successfully"}

async def run_scraping_process(force_full_scrape: bool = False):
    """Run the complete scraping and database insertion process"""
    try:
        from app.db.session import SessionLocal
        
        db = SessionLocal()
        try:
            scraping_status.current_step = "Checking database for latest records..."
            
            # Get latest date if not forcing full scrape
            latest_date = None if force_full_scrape else get_latest_tcb_date(db)
            
            scraping_status.current_step = "Scraping Excel links from TCB website..."
            links = scrape_excel_links()
            
            if not links:
                scraping_status.errors.append("No Excel links found")
                return
            
            # Filter links based on latest date
            if force_full_scrape:
                filtered_links = links
            else:
                filtered_links = filter_links_by_date(links, latest_date)
                
            if not filtered_links:
                scraping_status.current_step = "Complete - No new data found"
                return
                
            scraping_status.total_files = len(filtered_links)
            scraping_status.current_step = f"Processing {len(filtered_links)} Excel files..."
            
            # Process each Excel file
            for i, link in enumerate(filtered_links):
                try:
                    scraping_status.processed_files = i
                    scraping_status.progress = int((i / len(filtered_links)) * 100)
                    scraping_status.current_step = f"Processing file {i+1}/{len(filtered_links)}: {link['date']}"
                    
                    # Download and parse Excel
                    excel_data = download_excel_in_memory(link['url'])
                    if excel_data:
                        # Parse Excel to get scraped data
                        df = parse_excel(excel_data, link['date'], link['url'])
                        
                        if not df.empty:
                            # Convert DataFrame to list of dicts
                            scraped_data = df.to_dict('records')
                            
                            # Convert to database records
                            records = convert_scraped_data_to_records(scraped_data, db)
                            
                            # Insert records into database
                            for record in records:
                                try:
                                    crud.price_record.create_with_location(db=db, obj_in=record)
                                    scraping_status.records_created += 1
                                    db.commit()
                                except Exception as e:
                                    db.rollback()
                                    scraping_status.errors.append(f"Error inserting record: {str(e)}")
                    
                    time.sleep(1)  # Be respectful to the server
                    
                except Exception as e:
                    scraping_status.errors.append(f"Error processing {link['url']}: {str(e)}")
                    continue
            
            scraping_status.current_step = f"Complete - Processed {scraping_status.records_created} records"
            scraping_status.progress = 100
            
        finally:
            db.close()
            
    except Exception as e:
        scraping_status.errors.append(f"Critical error: {str(e)}")
        scraping_status.current_step = f"Failed: {str(e)}"
        
    finally:
        scraping_status.is_running = False

@router.post("/stop")
def stop_scraping() -> Dict[str, str]:
    """Stop the current scraping process"""
    if not scraping_status.is_running:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No scraping process is currently running"
        )
    
    scraping_status.is_running = False
    scraping_status.current_step = "Stopped by user"
    
    return {"message": "Scraping process stopped"} 