package pizzeria.deliveries.delivery.messaging.publisher;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import pizzeria.deliveries.config.RabbitConfig;
import pizzeria.deliveries.delivery.messaging.event.DeliveryStatusEvent;

@Service
@RequiredArgsConstructor
public class DeliveryEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishDeliveryStatus(DeliveryStatusEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.ORDER_ROUTING_KEY,
                event
        );
    }
}
