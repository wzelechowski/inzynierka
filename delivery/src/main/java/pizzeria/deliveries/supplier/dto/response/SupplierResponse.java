package pizzeria.deliveries.supplier.dto.response;

import pizzeria.deliveries.supplier.model.SupplierStatus;

import java.util.UUID;

public record SupplierResponse(
        UUID id,
        UUID userProfileId,
        String firstName,
        String lastName,
        String phoneNumber,
        SupplierStatus status
) {
}
