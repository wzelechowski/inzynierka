from repositories.feature_store import FeatureStoreRepository
from schemas.order_event import OrderEvent
from services.order_feature_extractor import OrderFeatureExtractor


class OrderEventHandler:

    def __init__(
        self,
        extractor: OrderFeatureExtractor,
        repository: FeatureStoreRepository
    ):
        self.extractor = extractor
        self.repository = repository

    def handle(self, event: OrderEvent):
        features = self.extractor.extract(event)
        self.repository.save(features)