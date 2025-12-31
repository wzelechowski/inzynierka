from repositories.feature_store import FeatureStoreRepository
from schemas.order_event import OrderEvent
from services.order_event_handler import OrderEventHandler
from services.order_feature_extractor import OrderFeatureExtractor
from core.mongo import order_feature_collection

EXCHANGE = "pizzeria.exchange"
QUEUE = "ai.queue"
ROUTING_KEY = "order.completed"

handler = OrderEventHandler(
    extractor=OrderFeatureExtractor(),
    repository=FeatureStoreRepository(order_feature_collection)
)

def handle_order_completed(ch, method, properties, body):
    try:
        print(body)
        event = OrderEvent.model_validate_json(body)
        handler.handle(event)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"[AI] Error: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)