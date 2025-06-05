"""
Utility functions for TCB commodity price scraping
"""
import pandas as pd
from io import BytesIO
import requests
import re
from datetime import datetime, date
import time
from urllib.parse import urljoin
from typing import List, Dict, Optional
import html
import json

# Configuration
BASE_URL = "https://tcb.gov.bd/site/view/daily_rmp/%E0%A6%A2%E0%A6%BE%E0%A6%95%E0%A6%BE-%E0%A6%AE%E0%A6%B9%E0%A6%BE%E0%A6%A8%E0%A6%97%E0%A6%B0%E0%A7%80%E0%A6%B0-%E0%A6%AC%E0%A6%BF%E0%A6%AD%E0%A6%BF%E0%A6%A8%E0%A7%8D%E0%A6%A8-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0%E0%A7%87%E0%A6%B0-%E0%A6%AE%E0%A7%82%E0%A6%B2%E0%A7%8D%E0%A6%AF"
API_URL = "https://tcb.gov.bd/api/datatable/daily_rmp_view.php?domain_id=6383&lang=bn&subdomain=tcb.portal.gov.bd&content_type=daily_rmp"

# Bengali to English digit mapping
BENGALI_TO_ENGLISH_DIGITS = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
}

# Commodity name mapping (Bengali to English, with variations)
COMMODITY_MAPPING = {
    "চাল সরু (নাজির/মিনিকেট)": "Fine Rice (Nazir/Miniket)",
    "চাল (মাঝারী)পাইজাম/আটাশ": "Medium Rice (Paijam/Atash)",
    "চাল (মাঝারী)পাইজাম/লতা": "Medium Rice (Paijam/Atash)",
    "চাল (মোটা)/স্বর্ণা/চায়না ইরি": "Coarse Rice (Swarna/China Iri)",
    "আটা সাদা (খোলা)": "White Flour (Loose)",
    "আটা (প্যাকেট)": "Flour (Packet)",
    "ময়দা (খোলা)": "Maida (Loose)",
    "ময়দা (প্যাকেট)": "Maida (Packet)",
    "সয়াবিন তেল (লুজ)": "Soybean Oil (Loose)",
    "সয়াবিন তেল (বোতল)": "Soybean Oil (Bottled)",
    "পাম অয়েল (লুজ)": "Palm Oil (Loose)",
    "পাম অয়েল (সুপার)":"Super Palm Oil (Loose)",

    "সুপার পাম অয়েল (লুজ)": "Super Palm Oil (Loose)",
    "রাইস ব্রান তেল (বোতল)": "Rice Bran Oil (Bottled)",
    "পাম অলিন (বোতল)": "Palm Olein (Bottled)",
    "মশুর ডাল (বড় দানা)": "Masoor Dal (Large Grain)",
    "মশূর ডাল (মাঝারী দানা)": "Masoor Dal (Medium Grain)",
    "মশুর ডাল (ছোট দানা)": "Masoor Dal (Small Grain)",
    "মুগ ডাল (মানভেদে)": "Moong Dal (Varies by Quality)",
    "এ্যাংকর ডাল": "Anchor Dal",
    "ছোলা (মানভেদে)": "Chickpea (Varies by Quality)",
    "আলু (মানভেদে)": "Potato (Varies by Quality)",
    "আলু (নতুন, মানভেদে)": "Potato (Varies by Quality)",
    "আলু (নতুন/পুরাতন)(মানভেদে)": "Potato (Varies by Quality)",
    "পিঁয়াজ (দেশী)": "Onion (Local)",
    "পিঁয়াজ (আমদানি)": "Onion (Imported)",
    "পিঁয়াজ (নতুন) (দেশী)": "Onion (Local)",
    "পিঁয়াজ (নতুন/পুরাতন) (দেশী)": "Onion (Local)",
    "পিঁয়াজ (দেশী)নতুন/পুরতান":"Onion (Local)",
    "রসুন (দেশী)": "Garlic (Local)",
    "রসুন (দেশী) ": "Garlic (Local)",  # Variation with space
    "রসুন (দেশী) নতুন/পুরাতন": "Garlic (Local)",

    "Garlic (Local)/পুরাতন": "Garlic (Local)",
    "রসুন(দেশী) নতুন": "Garlic (Local)",
    "রসুন (আমদানি)": "Garlic (Imported)",
    "শুকনা মরিচ (দেশী)": "Dry Chili (Local)",
    "শুকনা মরিচ (আমদানি)": "Dry Chili (Imported)",
    "হলুদ (দেশী)": "Turmeric (Local)",
    "হলুদ (আমদানি)": "Turmeric (Imported)",
    "আদা (দেশী)": "Ginger (Local)",
    "আদা (আমদানি)": "Ginger (Imported)",
    "আদা (দেশী)(নতুন)": "Ginger (Local)",
    "জিরা": "Cumin",
    "দারুচিনি": "Cinnamon",
    "লবঙ্গ": "Clove",
    "এলাচ(ছোট)": "Cardamom (Small)",
    "ধনে": "Coriander",
    "তেজপাতা": "Bay Leaf",
    "রুই": "Rui Fish",
    "ইলিশ": "Hilsa Fish",
    "গরু": "Beef",
    "খাসী": "Mutton",
    "মুরগী(ব্রয়লার)": "Broiler Chicken",
    "মুরগী (দেশী)": "Local Chicken",
    "গুড়া দুধ(প্যাকেটজাত)": "Powdered Milk (Packet)",
    "ডানো": "Dano Milk Powder",
    "ডিপ্লোমা (নিউজিল্যান্ড)": "Diploma Milk Powder (NZ)",
    "ফ্রেশ": "Fresh Milk Powder",
    "মার্কস": "Marks Milk Powder",
    "চিনি": "Sugar",
    "খেজুর(সাধারণ মানের)": "Dates (Ordinary Quality)",
    "লবণ(প্যাঃ)আয়োডিনযুক্ত": "Iodized Salt (Packet)",
    "লবণ(প্যাঃ)আয়োডিনযুক্ত(মানভেদে)": "Iodized Salt (Packet)",
    "ডিম (ফার্ম)": "Egg (Farm)",
    "লেখার কাগজ(সাদা)": "Writing Paper (White)",
    "এম,এস রড (৬০ গ্রেড)": "MS Rod (60 Grade)",
    "এম,এস রড( ৪০ গ্রেড)": "MS Rod (40 Grade)",
}

# Unit mapping (Bengali to English)
UNIT_MAPPING = {
    "প্রতি কেজি": "kg",
    "প্রতি লিটার": "liter",
    "৫ লিটার": "5 liter",
    "২ লিটার": "2 liter",
    "১ লিটার": "1 liter",
    "প্রতি হালি": "dozen",
    "প্রতি দিস্তা": "ream",
    "প্রতি মেঃটন": "metric ton",
    "প্রতি কেজি প্যাঃ": "kg",
    "১ কেজি": "kg",
}

# Market name mapping (Bengali to English)
MARKET_MAPPING = {
    "কাওরান বাজার": "Karwan Bazar",
    "মোহাম্মদপুর টাউন হল বাজার": "Mohammadpur Town Hall Bazar",
    "ঢাকা ক্যান্ট কচুক্ষেত বাজার": "Kachukhet Bazar",
    "নিউমার্কেট": "New Market",
    "মালিবাগ": "Malibag",
    "হাতিরপুল": "Hatirpool",
    "রামপুরা": "Rampura Bazar",
    "কাটাসুর কাঁচা বাজার": "Katasur Raw Bazar",
}

MARKETS_LIST = ", ".join(MARKET_MAPPING.values())

# Market names
MARKETS_LIST = "Karwan Bazar, Mohammadpur Town Hall Bazar, Kochukhet Bazar, New Market, Malibag, Hatirpool, Rampura Bazar, Katasur Raw Bazar"

def bengali_to_english_digits(bengali_str):
    """Convert Bengali digits to English digits"""
    return ''.join(BENGALI_TO_ENGLISH_DIGITS.get(c, c) for c in bengali_str)

def download_excel_in_memory(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    for attempt in range(3):
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            print(f"Successfully downloaded Excel from {url}")
            return BytesIO(response.content)
        except requests.RequestException as e:
            print(f"Error downloading {url} (attempt {attempt + 1}/3): {e}")
            time.sleep(2)
    return None

def normalize_string(text):
    return ''.join(str(text).split())

def parse_excel(excel_data, date, source_url):
    try:
        xls = pd.ExcelFile(excel_data, engine="openpyxl")
        sheet_names = xls.sheet_names

        target_sheet = None
        for sheet in sheet_names:
            if "daily retail price" in sheet.lower():
                target_sheet = sheet
                break
            elif "daily report" in sheet.lower():
                target_sheet = sheet
                break

        if target_sheet is None:
            print("Could not find a sheet with 'Daily retail price' or 'Daily report'")
            return pd.DataFrame()

        df = pd.read_excel(excel_data, sheet_name=target_sheet, header=None)

        # Extract market names dynamically
        market_names_bengali = []
        dynamic_markets_list = "Market names not found"
        for idx, row in df.iterrows():
            cell_value = str(row[0])
            if "বাজার হতে তথ্য সংগ্রহ করা হয়েছেঃ" in cell_value:
                match = re.search(r'ঃ[-]?\s*(.*)', cell_value)
                if match:
                    markets_str = match.group(1)
                    raw_markets = re.split(r',\s*', markets_str)
                    for m in raw_markets:
                        cleaned = m.strip().rstrip('।').strip()
                        if cleaned:
                            market_names_bengali.append(cleaned)
                break

        if market_names_bengali:
            translated_markets = []
            for m in market_names_bengali:
                translated = MARKET_MAPPING.get(m, m)
                translated_markets.append(translated)
            dynamic_markets_list = ", ".join(translated_markets)
        else:
            print("Warning: Market names not found, using default.")
            dynamic_markets_list = MARKETS_LIST

        data_start_idx = None
        for idx, row in df.iterrows():
            if "চাল সরু (নাজির/মিনিকেট)" in str(row[0]):
                data_start_idx = idx
                break

        if data_start_idx is None:
            print("Could not find data starting row")
            return pd.DataFrame()

        data_end_idx = len(df)
        for idx in range(data_start_idx, len(df)):
            if "যেসকল বাজার হতে" in str(df.iloc[idx, 0]):
                data_end_idx = idx
                break

        data_df = df.iloc[data_start_idx:data_end_idx, [0, 1, 2, 3]]
        data_df.columns = ["commodity_name", "unit", "price_min", "price_max"]
        data_df = data_df[data_df["commodity_name"].apply(lambda x: isinstance(x, str) and pd.notna(x) and x.strip() != "")]

        data = []
        id_counter = 1
        seen_commodities = set()

        for _, row in data_df.iterrows():
            commodity_name = row["commodity_name"].strip()
            normalized_commodity = normalize_string(commodity_name)
            translated_commodity = next(
                (v for k, v in COMMODITY_MAPPING.items() if normalized_commodity == normalize_string(k)),
                commodity_name
            )

            if translated_commodity in seen_commodities:
                continue
            seen_commodities.add(translated_commodity)

            unit = next(
                (v for k, v in UNIT_MAPPING.items() if normalize_string(row["unit"]) == normalize_string(k)),
                row["unit"]
            )

            min_price = pd.to_numeric(row["price_min"], errors='coerce')
            max_price = pd.to_numeric(row["price_max"], errors='coerce')

            if pd.isna(min_price) and pd.isna(max_price):
                continue
            if pd.isna(min_price):
                min_price = max_price
            if pd.isna(max_price):
                max_price = min_price

            avg_price = (min_price + max_price) / 2
            record = {
                "id": id_counter,
                "date": date,
                "commodity_name": translated_commodity,
                "commodity_price_average": avg_price,
                "commodity_price_highest": max_price,
                "commodity_price_lowest": min_price,
                "unit": unit,
                "location_district": "Dhaka",
                "location_sub_district": "",
                "exact_bazar_name": dynamic_markets_list,  # Use dynamically extracted markets
                "retail_or_wholesale": "retail",
                "shop_type_supershop_or_market_or_main_source": "market",
                "price_set_type_Government_set_price_or_local_price": "Government_set_price",
                "source": source_url,
                "source_type": "TCB",
            }
            data.append(record)
            id_counter += 1

        return pd.DataFrame(data)
    except Exception as e:
        print(f"Error parsing Excel: {e}")
        return pd.DataFrame()

def convert_bengali_date_to_standard(bengali_date_str):
    """Convert Bengali date string to standard date format"""
    # Convert Bengali digits to English digits
    english_date_str = bengali_to_english_digits(bengali_date_str)
    
    # Return the date string (already in YYYY-MM-DD format)
    return english_date_str

def scrape_excel_links() -> List[Dict[str, str]]:
    """Scrape Excel download links and dates using direct API calls instead of Selenium"""
    links = []
    seen_urls = set()
    
    # Parameters for pagination
    display_start = 0
    display_length = 100
    total_entries = None
    page = 1
    
    try:
        print(f"Making API requests to {API_URL}")
        
        while True:
            # Prepare form data for POST request
            form_data = {
                "sEcho": str(page),
                "iColumns": "5",
                "sColumns": ",,,,",
                "iDisplayStart": str(display_start),
                "iDisplayLength": str(display_length),
                "mDataProp_0": "0",
                "sSearch_0": "",
                "bRegex_0": "false",
                "bSearchable_0": "true",
                "mDataProp_1": "1",
                "sSearch_1": "",
                "bRegex_1": "false",
                "bSearchable_1": "true",
                "mDataProp_2": "2",
                "sSearch_2": "",
                "bRegex_2": "false",
                "bSearchable_2": "true",
                "mDataProp_3": "3",
                "sSearch_3": "",
                "bRegex_3": "false",
                "bSearchable_3": "true",
                "mDataProp_4": "4",
                "sSearch_4": "",
                "bRegex_4": "false",
                "bSearchable_4": "true",
                "sSearch": "",
                "bRegex": "false"
            }
            
            # Make API request
            headers = {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
            
            for attempt in range(3):
                try:
                    response = requests.post(API_URL, headers=headers, data=form_data, timeout=15)
                    response.raise_for_status()
                    data = response.json()
                    break
                except (requests.RequestException, json.JSONDecodeError) as e:
                    print(f"Error fetching API data (attempt {attempt + 1}/3): {e}")
                    if attempt == 2:
                        return links
                    time.sleep(2)
            
            # Get total entries on first request
            if total_entries is None:
                total_entries = data.get("iTotalRecords", 0)
                print(f"Total entries found: {total_entries}")
            
            # Process the data rows
            for row in data.get("data", []):
                if len(row) >= 5:
                    bengali_date_str = row[3]  # Date is in the 4th column (index 3)
                    bengali_time_str = row[2]  # Time is in the 3rd column (index 2)
                    download_html = row[4]  # Download column is the 5th column (index 4)
                    
                    # Convert Bengali date to standard format
                    standard_date = convert_bengali_date_to_standard(bengali_date_str)
                    standard_time = bengali_to_english_digits(bengali_time_str)
                    
                    # Extract href from the HTML snippet
                    href_match = re.search(r'href="([^"]+)"', html.unescape(download_html))
                    if href_match:
                        # Convert relative URL to absolute URL
                        relative_url = href_match.group(1)
                        if relative_url.startswith("//"):
                            link = "https:" + relative_url
                        else:
                            link = urljoin(BASE_URL, relative_url)
                        
                        if link in seen_urls:
                            continue
                        
                        seen_urls.add(link)
                        
                        # Format date and time (convert to standard format)
                        formatted_date = f"{standard_date} {standard_time}:00"
                        
                        links.append({"date": formatted_date, "url": link})
                        print(f"Found link: {link} for date: {formatted_date}")
            
            # Check if we need to fetch more pages
            if display_start + display_length >= total_entries:
                print(f"Completed scraping {len(links)} links from {page} pages")
                break
            
            # Increment for next page
            display_start += display_length
            page += 1
            print(f"Fetching page {page}...")
            time.sleep(1)  # Be respectful to the server
        
    except Exception as e:
        print(f"Error during API scraping: {e}")
    
    return links

def filter_links_by_date(links: List[Dict[str, str]], latest_date: Optional[date]) -> List[Dict[str, str]]:
    """Filter links to only include dates newer than the latest database record"""
    if latest_date is None:
        print("No latest date filter. Processing all links.")
        return links
    
    filtered_links = []
    for link in links:
        try:
            # Extract date from the link date string (format: "YYYY-MM-DD HH:MM:SS")
            link_date_str = link["date"].split()[0]  # Get just the date part
            link_date = datetime.strptime(link_date_str, "%Y-%m-%d").date()
            
            if link_date > latest_date:
                filtered_links.append(link)
                print(f"Including link for date: {link_date}")
            else:
                print(f"Skipping link for date: {link_date} (already in database)")
        except Exception as e:
            print(f"Error parsing date from link: {link['date']}, error: {e}")
            continue
    
    print(f"Filtered {len(filtered_links)} new links out of {len(links)} total links")
    return filtered_links 