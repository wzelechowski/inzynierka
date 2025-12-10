package pizzeria.deliveries.supplier.dto.request;

import org.hibernate.validator.constraints.Length;
import pizzeria.deliveries.supplier.model.SupplierStatus;

public record SupplierPatchRequest(
        @Length(min=2, max=50)
        String firstName,

        @Length(min=2, max=50)
        String lastName,

        @Length(min=2, max=50)
        String phoneNumber,

        SupplierStatus status
) {
}
