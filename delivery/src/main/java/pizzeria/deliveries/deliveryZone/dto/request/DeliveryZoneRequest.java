package pizzeria.deliveries.deliveryZone.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;

public record DeliveryZoneRequest(
        @NotBlank
        @Length(min=2, max=255)
        String name,

        @NotBlank
        @Length(min=2, max=255)
        String boundary,

        @NotNull
        BigDecimal baseDeliveryFee,

        @NotNull
        @Positive
        Integer minDeliveryTimeMinutes
) {
}
