import pika
from core.config import settings
from models.promotion_proposal import PromotionProposal


class RabbitPublisher:
    def __init__(self):
        self._connect()

    def _connect(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=settings.rabbit_host,
                port=settings.rabbit_port,
                heartbeat=60,
                blocked_connection_timeout=30
            )
        )
        self.channel = self.connection.channel()

        self.channel.exchange_declare(
            exchange="pizzeria.exchange",
            exchange_type="topic",
            durable=True
        )


    def publish(self, payload: PromotionProposal):
        if self.connection.is_closed or self.channel.is_closed:
            self._connect()

        self.channel.basic_publish(
            exchange="pizzeria.exchange",
            routing_key="promotion.proposed",
            body=payload.model_dump_json(by_alias=True),
            properties=pika.BasicProperties(
                content_type="application/json",
                delivery_mode=2
            )
        )