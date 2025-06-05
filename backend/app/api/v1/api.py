from fastapi import APIRouter

from app.api.v1.endpoints import commodities, prices, regions, users, analytics, price_analysis, locations, scraper

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(commodities.router, prefix="/commodities", tags=["commodities"])
api_router.include_router(regions.router, prefix="/regions", tags=["regions"])
api_router.include_router(prices.router, prefix="/prices", tags=["prices"])
api_router.include_router(locations.router, prefix="/locations", tags=["locations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(price_analysis.router, prefix="/price-analysis", tags=["price-analysis"])
api_router.include_router(scraper.router, prefix="/scraper", tags=["scraper"]) 