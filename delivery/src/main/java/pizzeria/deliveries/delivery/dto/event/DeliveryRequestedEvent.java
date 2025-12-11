package pizzeria.deliveries.delivery.dto.event;

import java.util.UUID;

public record DeliveryRequestedEvent(UUID orderId, UUID userId) {
}
