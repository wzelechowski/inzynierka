import pika
from core.config import settings
from .listener import handle_order_completed

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=settings.rabbit_host, port=settings.rabbit_port)
)

channel = connection.channel()

channel.exchange_declare(
    exchange="pizzeria_exchange",
    exchange_type="topic",
    durable=True
)

channel.queue_declare(
    queue="ai.queue",
    durable=True
)

channel.queue_bind(
    exchange="pizzeria_exchange",
    queue="ai.queue",
    routing_key="order.completed"
)

channel.basic_consume(
    queue="ai.queue",
    on_message_callback=handle_order_completed
)

channel.start_consuming()