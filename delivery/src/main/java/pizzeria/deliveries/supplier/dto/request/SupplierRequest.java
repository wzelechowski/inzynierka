package pizzeria.deliveries.supplier.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.UUID;

public record SupplierRequest(
        @NotNull
        UUID userProfileId,

        @NotBlank
        @Length(min=2, max=50)
        String firstName,

        @NotBlank
        @Length(min=2, max=50)
        String lastName,

        @NotBlank
        @Length(min=2, max=50)
        String phoneNumber
) {
}
