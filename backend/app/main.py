from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.v1.api import api_router
from app.db.session import get_db
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="BDTracks API",
    description="Bangladesh Commodity Price Tracking API",
    openapi_url=f"/api/v1/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; specify exact origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    logger.info("Application starting up...")
    # Import to ensure relationships are set up
    from app.db.setup_relationships import setup_relationships
    setup_relationships()
    # Note: Database seeding is now handled through Alembic migrations
    # Run 'alembic upgrade head' to apply migrations and seed data

@app.get("/")
def read_root():
    return {"message": "Welcome to BDTracks API"}

@app.get("/healthcheck")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 