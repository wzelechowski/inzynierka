package pizzeria.deliveries.delivery.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pizzeria.deliveries.config.RabbitConfig;
import pizzeria.deliveries.delivery.dto.event.DeliveryRequestedEvent;
import pizzeria.deliveries.delivery.model.Delivery;
import pizzeria.deliveries.delivery.repository.DeliveryRepository;

@Service
@RequiredArgsConstructor
public class DeliveryEventListener {
    private final DeliveryRepository deliveryRepository;

    @RabbitListener(queues = RabbitConfig.DELIVERY_QUEUE)
    public void delivery(DeliveryRequestedEvent event) {
        Delivery delivery = deliveryRepository.findDeliveriesByOrderId(null);
        if (delivery != null) {
            delivery.setOrderId(event.orderId());
            delivery.setUserId(event.userId());
            deliveryRepository.save(delivery);
        }
    }
}
