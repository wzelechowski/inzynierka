package pizzeria.deliveries.delivery.dto.event;

import pizzeria.deliveries.delivery.model.DeliveryStatus;

import java.util.UUID;

public record DeliveryStatusDomainEvent(
        UUID orderId,
        DeliveryStatus status
) {
}
