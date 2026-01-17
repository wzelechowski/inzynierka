package pizzeria.deliveries.supplier.dto.request;

import jakarta.validation.constraints.NotNull;
import pizzeria.deliveries.supplier.model.SupplierStatus;

public record SupplierChangeStatusRequest(
        @NotNull
        SupplierStatus status
) {
}
