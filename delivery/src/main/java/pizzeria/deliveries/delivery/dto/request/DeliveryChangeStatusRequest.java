package pizzeria.deliveries.delivery.dto.request;

import jakarta.validation.constraints.NotNull;
import pizzeria.deliveries.delivery.model.DeliveryStatus;

public record DeliveryChangeStatusRequest(
        @NotNull
        DeliveryStatus status
) {
}
