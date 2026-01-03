from schemas.order_event import OrderEvent

class OrderCompletedConsumer:
    def __init__(self, handler):
        self.handler = handler

    def on_message(self, ch, method, properties, body):
        try:
            event = OrderEvent.model_validate_json(body)
            self.handler.handle(event)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            print(e)
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
