from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from starlette.middleware.proxy_headers import ProxyHeadersMiddleware

from app.api.v1.api import api_router
from app.core.config import settings

# Set up logging
logging_level = logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO
logging.basicConfig(level=logging_level)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    logger.info(f"Application starting up in {settings.ENVIRONMENT} mode...")
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

# Enable reading of X-Forwarded-Host and X-Forwarded-Proto
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")
# Disable automatic trailing slash redirects to avoid external 307s
app.router.redirect_slashes = False

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
