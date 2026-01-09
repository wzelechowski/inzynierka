package pizzeria.deliveries.delivery.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record DeliverySupplierAssignRequest(
        @NotNull
        UUID supplierId
) {
}
