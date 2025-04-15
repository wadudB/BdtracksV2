# Import all models here so Alembic can detect them
from app.db.base_class import Base

# Import models without relationships first
from app.models.user import User
from app.models.region import Region
from app.models.commodity import Commodity
from app.models.supply_chain_stage import SupplyChainStage
from app.models.price_record import PriceRecord
from app.models.supply_chain_data import SupplyChainData
from app.models.price_history import PriceHistoryAggregated

# This import ensures all model relationships are configured
import app.db.setup_relationships 