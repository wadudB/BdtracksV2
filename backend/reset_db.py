"""
Reset and initialize database script.
This drops all tables and recreates them using Alembic migrations.
"""
import subprocess
import sys
import logging
from app.db.init_db import drop_all_tables
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main() -> int:
    try:
        logger.info("Dropping all existing tables...")
        drop_all_tables()
        
        logger.info("Running Alembic migrations...")
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        
        logger.info("Seeding initial data...")
        db = SessionLocal()
        try:
            # No need to initialize here since our migration includes seed data
            # init_db(db)
            logger.info("Database has been reset and initialized successfully!")
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 