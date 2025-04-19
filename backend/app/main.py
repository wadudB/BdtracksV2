from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.v1.api import api_router
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    logger.info("Application starting up...")
    from app.db.setup_relationships import setup_relationships
    setup_relationships()
    yield
    # Shutdown code (if any)

app = FastAPI(
    title="BDTracks API",
    description="Bangladesh Commodity Price Tracking API",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan
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

@app.get("/")
def read_root():
    return {"message": "Welcome to BDTracks API"}

@app.get("/healthcheck")
def health_check():
    return {"status": "ok"}
