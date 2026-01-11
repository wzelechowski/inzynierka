package pizzeria.user.address.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AddressRequest(
        String street,

        @NotBlank
        String buildingNumber,

        String flatNumber,

        @NotBlank
        String city,

        @NotBlank
        @Pattern(regexp = "\\d{2}-\\d{3}")
        String postalCode
) {
}
