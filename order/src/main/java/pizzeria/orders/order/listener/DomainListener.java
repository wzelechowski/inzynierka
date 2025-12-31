package pizzeria.orders.order.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import pizzeria.orders.order.dto.event.OrderCompletedDomainEvent;
import pizzeria.orders.order.messaging.event.OrderCompletedEvent;
import pizzeria.orders.order.messaging.publisher.OrderEventPublisher;
import pizzeria.orders.order.model.Order;
import pizzeria.orders.orderItem.model.OrderItem;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DomainListener {

    private final OrderEventPublisher orderEventPublisher;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderCompleted(OrderCompletedDomainEvent domainEvent) {
        Order order = domainEvent.order();

        List<UUID> orderItemsIds = order.getOrderItems()
                .stream()
                .map(OrderItem::getItemId)
                .toList();

        var event = new OrderCompletedEvent(
                order.getId(),
                order.getUserId(),
                order.getCreatedAt(),
                order.getTotalPrice(),
                orderItemsIds
        );

        orderEventPublisher.publishOrderCompleted(event);
    }
}
