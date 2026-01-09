package pizzeria.deliveries.delivery.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import pizzeria.deliveries.delivery.dto.event.DeliveryStatusDomainEvent;
import pizzeria.deliveries.delivery.messaging.event.DeliveryStatusEvent;
import pizzeria.deliveries.delivery.messaging.publisher.DeliveryEventPublisher;

@Component
@RequiredArgsConstructor
public class DomainListener {
    private final DeliveryEventPublisher deliveryEventPublisher;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDeliveryStatus(DeliveryStatusDomainEvent domainEvent) {
        var event = new DeliveryStatusEvent(domainEvent.orderId(), domainEvent.status());
        deliveryEventPublisher.publishDeliveryStatus(event);
    }
}
