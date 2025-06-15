from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.api.v1.api import api_router
from app.core.config import settings
import logging

# Configure OpenBLAS threading to prevent resource exhaustion
os.environ.setdefault('OPENBLAS_NUM_THREADS', '1')
os.environ.setdefault('OMP_NUM_THREADS', '1')
os.environ.setdefault('MKL_NUM_THREADS', '1')
os.environ.setdefault('NUMEXPR_NUM_THREADS', '1')

# Set up logging
logging_level = logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO
logging.basicConfig(level=logging_level)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    logger.info(f"Application starting up in {settings.ENVIRONMENT} mode...")
    logger.info(f"OpenBLAS threads: {os.environ.get('OPENBLAS_NUM_THREADS', 'not set')}")
    logger.info(f"OMP threads: {os.environ.get('OMP_NUM_THREADS', 'not set')}")
    from app.db.setup_relationships import setup_relationships
    setup_relationships()
    yield
    # Shutdown code (if any)

app = FastAPI(
    title="BDTracks API",
    description="Bangladesh Commodity Price Tracking API",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan,
    debug=settings.ENVIRONMENT == "development"
)

# Configure CORS
origins = settings.BACKEND_CORS_ORIGINS if settings.ENVIRONMENT == "production" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": f"Welcome to BDTracks API ({settings.ENVIRONMENT} environment)"}

@app.get("/healthcheck")
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
