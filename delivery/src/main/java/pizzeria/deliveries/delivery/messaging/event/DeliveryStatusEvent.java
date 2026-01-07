package pizzeria.deliveries.delivery.messaging.event;

import pizzeria.deliveries.delivery.model.DeliveryStatus;

import java.util.UUID;

public record DeliveryStatusEvent(
        UUID orderId,
        DeliveryStatus status
) {
}
