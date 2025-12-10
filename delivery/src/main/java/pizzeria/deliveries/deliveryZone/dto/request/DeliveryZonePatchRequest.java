package pizzeria.deliveries.deliveryZone.dto.request;

import java.math.BigDecimal;

public record DeliveryZonePatchRequest(
        String name,
        String boundary,
        BigDecimal baseDeliveryFee,
        Integer minDeliveryTimeMinutes
) {
}
