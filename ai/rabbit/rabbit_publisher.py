import json
import pika
from core.config import settings
from models.promotion_proposal import PromotionProposal


class RabbitPublisher:
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=settings.rabbit_host,
                port=settings.rabbit_port
            )
        )

        self.channel = self.connection.channel()

        self.channel.exchange_declare(
            exchange="pizzeria.exchange",
            exchange_type="topic",
            durable=True
        )

    def publish(self, payload: PromotionProposal):
        self.channel.basic_publish(
            exchange="pizzeria.exchange",
            routing_key="promotion.proposed",
            body=json.dumps(payload),
            properties=pika.BasicProperties(
                content_type="application/json",
                delivery_mode=2
            )
        )