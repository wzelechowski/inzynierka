package pizzeria.user.userProfile.messaging.publisher;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import pizzeria.user.config.RabbitConfig;
import pizzeria.user.userProfile.messaging.event.SupplierCreatedEvent;
import pizzeria.user.userProfile.messaging.event.SupplierDeletedEvent;

@Service
@RequiredArgsConstructor
public class UserProfileEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishSupplierCreated(SupplierCreatedEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.SUPPLIER_CREATED_ROUTING_KEY,
                event
        );
    }

    public void publishSupplierDeleted(SupplierDeletedEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.SUPPLIER_DELETED_ROUTING_KEY,
                event
        );
    }
}
