from core.mongo import order_feature_collection
from repositories.feature_store import FeatureStoreRepository
from services.order_event_handler import OrderEventHandler
from services.order_feature_extractor import OrderFeatureExtractor


def get_order_event_handler():
    extractor = OrderFeatureExtractor()
    repo = FeatureStoreRepository(order_feature_collection)
    return OrderEventHandler(extractor, repo)