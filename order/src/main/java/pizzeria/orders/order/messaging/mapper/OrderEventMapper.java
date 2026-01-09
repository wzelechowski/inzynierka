package pizzeria.orders.order.messaging.mapper;

import org.springframework.stereotype.Component;
import pizzeria.orders.order.messaging.event.OrderStatusEvent;
import pizzeria.orders.order.dto.request.OrderPatchRequest;
import pizzeria.orders.order.model.DeliveryStatus;
import pizzeria.orders.order.model.OrderStatus;

import java.time.LocalDateTime;

import static pizzeria.orders.order.model.DeliveryStatus.valueOf;

@Component
public class OrderEventMapper {

    public OrderPatchRequest toPatchRequest(OrderStatusEvent event) {
        OrderStatus status = mapStatus(valueOf(event.status()));
        LocalDateTime deliveredAt =
                status == OrderStatus.COMPLETED
                ? LocalDateTime.now()
                : null;

        return new OrderPatchRequest(status, deliveredAt);
    }

    private OrderStatus mapStatus(DeliveryStatus status) {
        return switch (status) {
            case PICKED_UP -> OrderStatus.DELIVERY;
            case DELIVERED -> OrderStatus.COMPLETED;
            case CANCELLED -> OrderStatus.CANCELLED;
        };
    }

}
