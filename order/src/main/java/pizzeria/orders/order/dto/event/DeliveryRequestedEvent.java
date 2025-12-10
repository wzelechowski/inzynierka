package pizzeria.orders.order.dto.event;

import java.util.UUID;

public record DeliveryRequestedEvent(UUID orderId) {
}
