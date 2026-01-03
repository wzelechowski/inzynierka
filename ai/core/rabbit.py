import logging

from rabbit.rabbit_publisher import RabbitPublisher

logger = logging.getLogger(__name__)

_publisher: RabbitPublisher | None = None

def init_global():
    global _publisher
    try:
        _publisher = RabbitPublisher()
        logger.info("Publisher initialized")
    except Exception as e:
        _publisher = None
        logger.info("Publisher unavailable: {e}")

def get_publisher() -> RabbitPublisher | None:
    return _publisher