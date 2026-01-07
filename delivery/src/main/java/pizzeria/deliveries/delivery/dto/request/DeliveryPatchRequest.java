package pizzeria.deliveries.delivery.dto.request;

import pizzeria.deliveries.delivery.model.DeliveryStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record DeliveryPatchRequest(
        UUID supplierId,
        DeliveryStatus status,
        LocalDateTime assignedAt,
        LocalDateTime pickedUpAt,
        LocalDateTime deliveredAt,
        BigDecimal fee
) {
}
