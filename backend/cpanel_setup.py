#!/usr/bin/env python
"""
cPanel Setup Script for BdTracks Backend

This script helps with setting up the Python application on cPanel. It:
1. Verifies the environment
2. Creates a proper .htaccess file for FastAPI with passenger_wsgi.py
3. Creates passenger_wsgi.py file to work with cPanel Python apps
"""

import os
import sys
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("cpanel_setup")

def create_htaccess():
    """Create .htaccess file for FastAPI application in cPanel"""
    domain_name = os.getenv("DOMAIN_NAME", "")
    allowed_origin = f"https://{domain_name}" if domain_name else "*"
    
    htaccess_content = f"""
# Use the Python interpreter provided by cPanel
AddHandler cgi-script .py
AddHandler default-handler .html .htm .jpg .jpeg .png .gif .css .js

# Redirect all requests to the passenger_wsgi.py script
RewriteEngine On
RewriteCond %{{REQUEST_FILENAME}} !-f
RewriteRule ^(.*)$ /passenger_wsgi.py/$1 [L]

# Set up CORS headers
Header set Access-Control-Allow-Origin "{allowed_origin}"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
Header set Access-Control-Allow-Credentials "true"
"""
    with open(".htaccess", "w") as f:
        f.write(htaccess_content.strip())
    logger.info(f"Created .htaccess file with CORS for {allowed_origin}")

def create_passenger_wsgi():
    """Create passenger_wsgi.py file for cPanel"""
    passenger_content = """
import sys
import os
import logging
from pathlib import Path

# Configure logging for debugging
logging.basicConfig(
    filename='passenger_wsgi.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("passenger_wsgi")

# Add the current directory to the path
CURRENT_DIR = Path(__file__).parent
sys.path.insert(0, str(CURRENT_DIR))

try:
    # Point to the application
    logger.info("Importing FastAPI application")
    from app.main import app as application
    logger.info("Successfully imported FastAPI application")
except Exception as e:
    logger.error(f"Error importing application: {str(e)}")
    raise
"""
    with open("passenger_wsgi.py", "w") as f:
        f.write(passenger_content.strip())
    logger.info("Created passenger_wsgi.py file")

def main():
    """Main setup function"""
    logger.info("Starting cPanel setup for BdTracks Backend")
    
    # Make sure we're in the right directory
    if not os.path.exists("app") or not os.path.exists("alembic"):
        logger.error("Please run this script from the backend root directory")
        sys.exit(1)
    
    create_htaccess()
    create_passenger_wsgi()
    
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    logger.info("Created logs directory")
    
    logger.info("cPanel setup complete!")
    
if __name__ == "__main__":
    main() 