package pizzeria.deliveries.delivery.messaging.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pizzeria.deliveries.config.RabbitConfig;
import pizzeria.deliveries.delivery.messaging.mapper.DeliveryEventMapper;
import pizzeria.deliveries.delivery.messaging.event.DeliveryRequestedEvent;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.service.DeliveryService;

@Service
@RequiredArgsConstructor
public class DeliveryEventListener {
    private final DeliveryService deliveryService;
    private final DeliveryEventMapper deliveryEventMapper;

    @RabbitListener(queues = RabbitConfig.DELIVERY_QUEUE)
    public void delivery(DeliveryRequestedEvent event) {
        DeliveryRequest request = deliveryEventMapper.toRequest(event);
        deliveryService.save(request);
    }
}
