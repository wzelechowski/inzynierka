package pizzeria.orders.order.dto.event;

import java.util.UUID;

public record OrderRequestedEvent(UUID orderId, UUID userId) {
}
