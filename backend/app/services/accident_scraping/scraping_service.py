from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
import gc
import os

from .calculate_summary import CalculateSummaryService
from .scrapingapi.scrapenews import ScrapingApi
from app.core.config import settings


class AccidentScrapingService:
    """Service for scraping accident data and calculating summaries"""
    
    def __init__(self):
        # Set OpenBLAS threading limits if not already set
        if 'OPENBLAS_NUM_THREADS' not in os.environ:
            os.environ['OPENBLAS_NUM_THREADS'] = '1'
        if 'OMP_NUM_THREADS' not in os.environ:
            os.environ['OMP_NUM_THREADS'] = '1'
            
        self.calculate_summary_service = CalculateSummaryService()
        self.scraping_api = ScrapingApi()
    
    def scrape_daily_accident_data(self, db: Session) -> Dict[str, Any]:
        """
        Scrape daily accident data and calculate summary
        
        Args:
            db: Database session
            
        Returns:
            Dict containing success status and summary data
        """
        scraping_completed = False
        scraping_error = None
        
        try:
            # Run the scraping process using the SQLAlchemy session
            scraping_result = self.scraping_api.run_scraping(db)
            scraping_completed = bool(scraping_result)
            
            # Force garbage collection after scraping
            gc.collect()
            
        except MemoryError as e:
            scraping_error = f"Memory error during scraping: {str(e)}"
            print(f"Memory error in scraping: {e}")
            # Force garbage collection on memory error
            gc.collect()
        except Exception as e:
            scraping_error = str(e)
            print(f"Scraping failed: {e}")
            # Continue to calculate summary even if scraping fails
        
        try:
            # Always try to calculate summary from existing data
            summary = self.calculate_summary_service.get_summary(db)
            
            # Force garbage collection after summary calculation
            gc.collect()
            
            message = "Success"
            if scraping_error:
                if "OPENAI_API_KEY" in scraping_error:
                    message = "Summary calculated successfully. Note: New data scraping skipped (OpenAI API key not configured)"
                elif "Memory error" in scraping_error:
                    message = f"Summary calculated successfully. Note: New data scraping failed due to memory constraints"
                else:
                    message = f"Summary calculated successfully. Note: New data scraping failed ({scraping_error})"
            
            return {
                "message": message,
                "scraping_completed": scraping_completed,
                "summary": summary,
                "scraping_error": scraping_error
            }
            
        except Exception as e:
            print(f"An error occurred during summary calculation: {e}")
            # Force garbage collection before raising exception
            gc.collect()
            raise Exception(f"Summary calculation failed: {str(e)}") 