import asyncio
import json
import threading
import pika
from core.config import settings
from core.mongo import order_feature_collection
from dependencies.get_apriori_reccomendation_service import get_apriori_recommendation_service
from repositories.feature_store import FeatureStoreRepository
from services.order_event_handler import OrderEventHandler
from services.order_feature_extractor import OrderFeatureExtractor
from rabbit.order_completed_consumer import OrderCompletedConsumer

loop = asyncio.new_event_loop()


def start_background_loop(loop):
    asyncio.set_event_loop(loop)
    loop.run_forever()


t = threading.Thread(target=start_background_loop, args=(loop,), daemon=True)
t.start()


def run_async_task(coroutine):
    future = asyncio.run_coroutine_threadsafe(coroutine, loop)
    return future.result()


connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=settings.rabbit_host, port=settings.rabbit_port)
)
consumer_channel = connection.channel()

consumer_channel.exchange_declare(
    exchange="pizzeria.exchange",
    exchange_type="topic",
    durable=True
)
consumer_channel.queue_declare(queue="ai.queue", durable=True)

consumer_channel.queue_bind(exchange="pizzeria.exchange", queue="ai.queue", routing_key="order.completed")
consumer_channel.queue_bind(exchange="pizzeria.exchange", queue="ai.queue", routing_key="ai.generate")

handler = OrderEventHandler(
    extractor=OrderFeatureExtractor(),
    repository=FeatureStoreRepository(order_feature_collection)
)
consumer = OrderCompletedConsumer(handler)


def main_callback(ch, method, properties, body):
    routing_key = method.routing_key
    try:
        if routing_key == 'order.completed':
            consumer.on_message(ch, method, properties, body)
        elif routing_key == 'ai.generate':
            payload = json.loads(body)
            days_back = payload.get("daysBack", 30)
            max_proposals = payload.get("maxProposals", 5)

            ai_service = get_apriori_recommendation_service()

            proposals = run_async_task(
                ai_service.generate(max_proposals=max_proposals, days_back=days_back)
            )

            for proposal in proposals:
                single_proposal_json = proposal.model_dump_json(by_alias=True)

                ch.basic_publish(
                    exchange="pizzeria.exchange",
                    routing_key="promotion.proposed",
                    body=single_proposal_json,
                    properties=pika.BasicProperties(
                        content_type='application/json',
                        delivery_mode=2
                    )
                )

            ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

    except Exception as e:
        print(f"Error: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


consumer_channel.basic_qos(prefetch_count=1)
consumer_channel.basic_consume(queue="ai.queue", on_message_callback=main_callback)

consumer_channel.start_consuming()