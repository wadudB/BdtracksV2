# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.commodity import Commodity  # noqa
from app.models.price_record import PriceRecord  # noqa
from app.models.region import Region  # noqa
from app.models.user import User  # noqa

# This import ensures all model relationships are configured
import app.db.setup_relationships 