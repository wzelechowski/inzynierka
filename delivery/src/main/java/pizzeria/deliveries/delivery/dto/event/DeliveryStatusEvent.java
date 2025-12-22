package pizzeria.deliveries.delivery.dto.event;

import pizzeria.deliveries.delivery.model.DeliveryStatus;

import java.util.UUID;

public record DeliveryStatusEvent(
        UUID orderId,
        UUID userId,
        DeliveryStatus status
) {
}
