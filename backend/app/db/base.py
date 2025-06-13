# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.accident_data import AccidentData  # noqa
from app.models.commodity import Commodity  # noqa
from app.models.location import Location  # noqa
from app.models.price_record import PriceRecord  # noqa
from app.models.region import Region  # noqa
from app.models.user import User  # noqa
from app.models.all_accidents_data import AllAccidentsData  # noqa

# This import ensures all model relationships are configured
import app.db.setup_relationships 