import pika
from core.config import settings
from core.mongo import order_feature_collection
from repositories.feature_store import FeatureStoreRepository
from services.order_event_handler import OrderEventHandler
from services.order_feature_extractor import OrderFeatureExtractor
from .order_completed_consumer import OrderCompletedConsumer


connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=settings.rabbit_host, port=settings.rabbit_port)
)

consumer_channel = connection.channel()

consumer_channel.exchange_declare(
    exchange="pizzeria.exchange",
    exchange_type="topic",
    durable=True
)

consumer_channel.queue_declare(
    queue="ai.queue",
    durable=True
)


consumer_channel.queue_bind(
    exchange="pizzeria.exchange",
    queue="ai.queue",
    routing_key="order.completed"
)

handler = OrderEventHandler(
    extractor=OrderFeatureExtractor(),
    repository=FeatureStoreRepository(order_feature_collection)
)

consumer = OrderCompletedConsumer(handler)

consumer_channel.basic_consume(
    queue="ai.queue",
    on_message_callback=consumer.on_message
)

consumer_channel.start_consuming()