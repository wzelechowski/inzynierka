package pizzeria.orders.order.messaging.publisher;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import pizzeria.orders.config.RabbitConfig;
import pizzeria.orders.order.messaging.event.OrderCompletedEvent;
import pizzeria.orders.order.messaging.event.OrderRequestedEvent;

@Service
@RequiredArgsConstructor
public class OrderEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishDeliveryRequested(OrderRequestedEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.DELIVERY_ROUTING_KEY,
                event
        );
    }

    public void publishOrderCompleted(OrderCompletedEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.AI_ROUTING_KEY,
                event
        );
    }
}
