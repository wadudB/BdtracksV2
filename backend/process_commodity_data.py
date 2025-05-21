import pandas as pd
import datetime
import argparse
import csv
from typing import List, Dict, Any
import json
import sys
import os
import time

# Add the backend directory to the path so we can import from app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

# Import the database and CRUD operations
from app.db.session import SessionLocal
from app.crud import price_record
from app.schemas.price_record import PriceRecordCreate

# Commodity name to ID mapping from the database
commodity_mapping = {
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

# Define bazar name to place_id mapping
bazar_place_ids = {
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

def parse_date(date_string: str) -> str:
    """
    Parse a date string in various formats to YYYY-MM-DD
    """
    date_string = date_string.strip()
    
    # Try different date formats
    formats = ['%m/%d/%Y', '%Y-%m-%d']
    
    for date_format in formats:
        try:
            return datetime.datetime.strptime(date_string, date_format).strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    # If we get here, none of the formats worked
    raise ValueError(f"Could not parse date: {date_string}")

def process_commodity_csv(csv_path: str, dry_run: bool = True) -> List[Dict[str, Any]]:
    """
    Process the commodity CSV and return structured data for database insertion
    
    Args:
        csv_path: Path to the CSV file
        dry_run: If True, just print records; if False, insert into database
        
    Returns:
        List of record dictionaries prepared for insertion
    """
    try:
        df = pd.read_csv(csv_path)
        total_rows = len(df)
        print(f"Total rows in CSV: {total_rows}")
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        # Fallback to standard CSV reader if pandas fails
        records = []
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                records.append(row)
        df = pd.DataFrame(records)
        total_rows = len(df)
        print(f"Total rows in CSV: {total_rows}")
    
    records_to_create = []
    skipped_rows = 0
    processed_rows = 0
    
    for index, row in df.iterrows():
        processed_rows += 1
        if processed_rows % 100 == 0 or processed_rows == total_rows:
            print(f"Processing row {processed_rows}/{total_rows} ({processed_rows/total_rows*100:.1f}%)")
        
        # Parse date
        date_str = row['date'].split()[0]  # Get date part
        try:
            recorded_date = parse_date(date_str)
        except ValueError:
            print(f"Warning: Invalid date format in row {index}: {date_str}. Skipping.")
            skipped_rows += 1
            continue
        
        # Get commodity details
        commodity_name = row['commodity_name']
        
        # Look up commodity ID
        if commodity_name in commodity_mapping:
            commodity_id = commodity_mapping[commodity_name]
        else:
            print(f"Warning: Unknown commodity name in row {index}: {commodity_name}. Skipping.")
            skipped_rows += 1
            continue
        
        try:
            min_price = None
            max_price = None
            
            if pd.notna(row['commodity_price_lowest']):
                min_price = int(float(row['commodity_price_lowest']))
                
            if pd.notna(row['commodity_price_highest']):
                max_price = int(float(row['commodity_price_highest']))
                
            if min_price is None and max_price is None:
                print(f"Warning: No valid price data in row {index}. Skipping.")
                skipped_rows += 1
                continue
        except (ValueError, TypeError):
            print(f"Warning: Invalid price format in row {index}. Skipping.")
            skipped_rows += 1
            continue
            
        district = row['location_district']
        source = row['source']
        unit = row['unit'] if pd.notna(row['unit']) else ""
        
        # Process each bazar in the comma-separated list
        if pd.notna(row['exact_bazar_name']):
            bazars = [b.strip() for b in row['exact_bazar_name'].split(',')]
            
            for bazar in bazars:
                # Skip specified bazars
                if bazar in skip_bazars:
                    continue
                    
                # Check if we have a place_id for this bazar
                if bazar in bazar_place_ids:
                    place_id = bazar_place_ids[bazar]
                    
                    # Create a record for min price if available
                    if min_price is not None:
                        min_record = {
                            "commodity_id": commodity_id,
                            "region_id": 1,  # Using 1 for all regions as specified
                            "price": min_price,
                            "recorded_by": None,  # Setting to NULL instead of user_id
                            "source": source,
                            "notes": f"Lowest price. Unit: {unit}",
                            "location_id": 0,  # Will be created from location object
                            "recorded_at": recorded_date,
                            "location": {
                                "name": bazar,
                                "address": f"{bazar}, {district}",
                                "latitude": 0,
                                "longitude": 0,
                                "place_id": place_id,
                                "poi_id": ""
                            }
                        }
                        records_to_create.append(min_record)
                    
                    # Create a record for max price if available
                    if max_price is not None:
                        max_record = {
                            "commodity_id": commodity_id,
                            "region_id": 1,  # Using 1 for all regions as specified
                            "price": max_price,
                            "recorded_by": None,  # Setting to NULL instead of user_id
                            "source": source,
                            "notes": f"Highest price. Unit: {unit}",
                            "location_id": 0,  # Will be created from location object
                            "recorded_at": recorded_date,
                            "location": {
                                "name": bazar,
                                "address": f"{bazar}, {district}",
                                "latitude": 0,
                                "longitude": 0,
                                "place_id": place_id,
                                "poi_id": ""
                            }
                        }
                        records_to_create.append(max_record)
                else:
                    print(f"Warning: No place_id found for bazar: {bazar}")
    
    print(f"Processed {processed_rows} rows, skipped {skipped_rows} rows")
    print(f"Created {len(records_to_create)} records (2 per valid location-commodity pair)")
    return records_to_create

def save_records_to_db(records: List[Dict[str, Any]], dry_run: bool = True):
    """Save the processed records to the database"""
    if dry_run:
        print(f"DRY RUN: Would insert {len(records)} records")
        for i, record in enumerate(records[:5]):  # Print first 5 for preview
            print(f"Record {i+1}:")
            print(json.dumps(record, indent=2))
        if len(records) > 5:
            print(f"... and {len(records) - 5} more records")
        return
    
    # Create database session
    db = SessionLocal()
    try:
        success_count = 0
        error_count = 0
        total_records = len(records)
        start_time = time.time()
        last_report_time = start_time
        
        for i, record in enumerate(records):
            try:
                # Convert dict to PriceRecordCreate schema
                record_in = PriceRecordCreate(**record)
                price_record.create_with_location(db=db, obj_in=record_in)
                success_count += 1
                # Commit after each successful insertion
                db.commit()
                
                # Report progress every 50 records or 30 seconds
                current_time = time.time()
                if (i + 1) % 50 == 0 or (current_time - last_report_time) > 30 or (i + 1) == total_records:
                    elapsed_time = current_time - start_time
                    records_per_second = (i + 1) / elapsed_time if elapsed_time > 0 else 0
                    estimated_remaining = (total_records - (i + 1)) / records_per_second if records_per_second > 0 else 0
                    
                    print(f"Progress: {i+1}/{total_records} ({(i+1)/total_records*100:.1f}%)")
                    print(f"Success: {success_count}, Errors: {error_count}")
                    print(f"Speed: {records_per_second:.1f} records/second")
                    print(f"Est. time remaining: {estimated_remaining/60:.1f} minutes")
                    last_report_time = current_time
                
            except Exception as e:
                error_count += 1
                db.rollback()  # Roll back on error
                if error_count <= 20:  # Only print the first 20 errors to avoid flooding the console
                    print(f"Error inserting record {i+1}/{total_records}: {e}")
                    print(f"Record data: {record}")
                elif error_count == 21:
                    print("Additional errors suppressed. Only showing error count from now on.")
                
                # Still report progress on errors at the same intervals
                if (i + 1) % 50 == 0:
                    print(f"Progress: {i+1}/{total_records} ({(i+1)/total_records*100:.1f}%)")
                    print(f"Success: {success_count}, Errors: {error_count}")
                
        total_time = time.time() - start_time
        print(f"\nImport complete in {total_time/60:.1f} minutes.")
        print(f"Successfully inserted {success_count} records. Errors: {error_count}")
        
    finally:
        db.close()

def main():
    parser = argparse.ArgumentParser(description='Process commodity price CSV and import to database')
    parser.add_argument('csv_file', help='Path to CSV file with commodity price data')
    parser.add_argument('--import', dest='do_import', action='store_true', 
                        help='Actually import data (without this flag, it does a dry run)')
    
    args = parser.parse_args()
    
    print(f"Processing CSV file: {args.csv_file}")
    records = process_commodity_csv(
        args.csv_file,
        dry_run=not args.do_import
    )
    
    print(f"Found {len(records)} records to import")
    save_records_to_db(records, dry_run=not args.do_import)

if __name__ == "__main__":
    main() 