from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from .calculate_summary import CalculateSummaryService
from .scrapingapi.scrapenews import ScrapingApi
from app.core.config import settings


class AccidentScrapingService:
    """Service for scraping accident data and calculating summaries"""
    
    def __init__(self):
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
        except Exception as e:
            scraping_error = str(e)
            print(f"Scraping failed: {e}")
            # Continue to calculate summary even if scraping fails
        
        try:
            # Always try to calculate summary from existing data
            summary = self.calculate_summary_service.get_summary(db)
            
            message = "Success"
            if scraping_error:
                if "OPENAI_API_KEY" in scraping_error:
                    message = "Summary calculated successfully. Note: New data scraping skipped (OpenAI API key not configured)"
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
            raise Exception(f"Summary calculation failed: {str(e)}") 