package pizzeria.orders.order.messaging.event;

import java.util.UUID;

public record OrderStatusEvent(
        UUID orderId,
        String status
) {
}
