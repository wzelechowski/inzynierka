package pizzeria.deliveries.delivery.messaging.event;

import java.util.UUID;

public record DeliveryRequestedEvent(
        UUID orderId,
        String deliveryAddress,
        String deliveryCity,
        String postalCode
) {
}
