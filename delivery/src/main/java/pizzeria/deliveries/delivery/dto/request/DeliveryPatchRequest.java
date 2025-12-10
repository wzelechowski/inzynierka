package pizzeria.deliveries.delivery.dto.request;

import pizzeria.deliveries.delivery.model.DeliveryStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DeliveryPatchRequest(
        DeliveryStatus status,
        LocalDateTime assignedAt,
        LocalDateTime pickedUpAt,
        LocalDateTime deliveredAt,
        BigDecimal fee
) {
}
