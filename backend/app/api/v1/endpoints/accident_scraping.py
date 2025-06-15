from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Any, Dict
from datetime import datetime
import threading
from concurrent.futures import ThreadPoolExecutor

from app.db.session import get_db, SessionLocal
from app.services.accident_scraping.scraping_service import AccidentScrapingService
from app.schemas.accident_scraping import AccidentScrapingResponse

router = APIRouter()

# Status tracking for accident scraping
class AccidentScrapingStatus:
    """Class to track accident scraping status"""
    def __init__(self):
        self.is_running = False
        self.progress = 0
        self.current_step = ""
        self.start_time = None
        self.errors = []
        self.last_result = None

# Global status instance
accident_scraping_status = AccidentScrapingStatus()

# Create a thread pool executor for background tasks with a lock for thread safety
executor = ThreadPoolExecutor(max_workers=1)
status_lock = threading.RLock()


@router.get("/status")
async def get_accident_scraping_status() -> Dict[str, Any]:
    """Get current accident scraping status"""
    with status_lock:
        return {
            "is_running": accident_scraping_status.is_running,
            "progress": accident_scraping_status.progress,
            "current_step": accident_scraping_status.current_step,
            "start_time": accident_scraping_status.start_time,
            "errors": accident_scraping_status.errors[-10:],  # Last 10 errors
            "duration": (datetime.now() - accident_scraping_status.start_time).total_seconds() if accident_scraping_status.start_time else None,
            "last_result": accident_scraping_status.last_result
        }

@router.post("/start")
async def start_accident_scraping(
    background_tasks: BackgroundTasks
) -> Dict[str, str]:
    """Start accident data scraping process in background"""
    
    with status_lock:
        if accident_scraping_status.is_running:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Accident scraping is already in progress"
            )
        
        # Reset status
        accident_scraping_status.is_running = True
        accident_scraping_status.progress = 0
        accident_scraping_status.current_step = "Starting accident data scraping..."
        accident_scraping_status.errors = []
        accident_scraping_status.start_time = datetime.now()
        accident_scraping_status.last_result = None
    
    # Start background thread using ThreadPoolExecutor
    future = executor.submit(run_accident_scraping_thread)
    
    # Add error callback
    def handle_completion(future):
        try:
            result = future.result()  # This will raise any exception that occurred in the thread
            with status_lock:
                accident_scraping_status.last_result = result
                accident_scraping_status.current_step = "Completed successfully"
                accident_scraping_status.progress = 100
        except Exception as e:
            with status_lock:
                accident_scraping_status.errors.append(f"Unexpected thread error: {str(e)}")
                accident_scraping_status.current_step = f"Failed with error: {str(e)}"
        finally:
            with status_lock:
                accident_scraping_status.is_running = False
    
    future.add_done_callback(handle_completion)
    
    return {"message": "Accident scraping started successfully in background"}

@router.get("/scrape-daily-accident-data", response_model=AccidentScrapingResponse)
def scrape_daily_accident_data_sync(
    db: Session = Depends(get_db)
) -> AccidentScrapingResponse:
    """
    Scrape daily accident data and calculate summary statistics (synchronous - for testing)
    
    Note: For production use, prefer the /start endpoint which runs in background
    
    Returns:
        Dict containing success message and summary data
    """
    try:
        scraping_service = AccidentScrapingService()
        result = scraping_service.scrape_daily_accident_data(db)
        
        return AccidentScrapingResponse(**result)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during scraping: {str(e)}"
        )

def run_accident_scraping_thread():
    """Run the accident scraping process in a separate thread"""
    try:
        # Create a new db session for this thread
        db = SessionLocal()
        try:
            with status_lock:
                accident_scraping_status.current_step = "Initializing scraping service..."
                accident_scraping_status.progress = 10
            
            scraping_service = AccidentScrapingService()
            
            with status_lock:
                accident_scraping_status.current_step = "Running accident data scraping..."
                accident_scraping_status.progress = 50
            
            result = scraping_service.scrape_daily_accident_data(db)
            
            with status_lock:
                accident_scraping_status.current_step = "Scraping completed, finalizing..."
                accident_scraping_status.progress = 90
            
            return result
            
        finally:
            db.close()
    except Exception as e:
        with status_lock:
            accident_scraping_status.errors.append(f"Thread error: {str(e)}")
            accident_scraping_status.current_step = f"Failed in thread: {str(e)}"
        raise

@router.post("/stop")
async def stop_accident_scraping() -> Dict[str, str]:
    """Stop the current accident scraping process"""
    with status_lock:
        if not accident_scraping_status.is_running:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No accident scraping process is currently running"
            )
        
        accident_scraping_status.is_running = False
        accident_scraping_status.current_step = "Stopped by user"
    
    return {"message": "Accident scraping process stopped"} 