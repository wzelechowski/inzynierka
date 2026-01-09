package pizzeria.deliveries.delivery.dto.response;

import pizzeria.deliveries.delivery.model.DeliveryStatus;
import pizzeria.deliveries.supplier.dto.response.SupplierResponse;

import java.time.LocalDateTime;
import java.util.UUID;

public record DeliveryResponse(
        UUID id,
        UUID orderId,
        SupplierResponse supplier,
        DeliveryStatus status,
        String deliveryAddress,
        String deliveryCity,
        String postalCode,
        LocalDateTime assignedAt,
        LocalDateTime pickedUpAt,
        LocalDateTime deliveredAt
) {
}
