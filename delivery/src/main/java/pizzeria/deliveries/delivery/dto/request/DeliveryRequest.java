package pizzeria.deliveries.delivery.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;

import java.util.UUID;

public record DeliveryRequest(
        @NotNull
        UUID orderId,

        @NotNull
        UUID supplierId,

        @NotBlank
        @Length(min=2, max=255)
        String deliveryAddress,

        @NotBlank
        @Length(min=2, max=255)
        String deliveryCity,

        @NotBlank
        @Pattern(regexp = "\\d{2}-\\d{3}", message = "Postal code must be in format 00-000")
        String postalCode
) {
}
