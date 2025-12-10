package pizzeria.deliveries.deliveryZone.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record DeliveryZoneResponse(
        UUID id,
        String name,
        String boundary,
        BigDecimal baseDeliveryFee,
        Integer minDeliveryTimeMinutes
) {
}
