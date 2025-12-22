package pizzeria.orders.order.messaging.event;

import java.util.UUID;

public record OrderRequestedEvent(UUID orderId, UUID userId) {
}
