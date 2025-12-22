package pizzeria.orders.order.messaging.event;

import java.util.UUID;

public record OrderStatusEvent(
        UUID orderId,
        UUID userId,
        String status
) {
}
