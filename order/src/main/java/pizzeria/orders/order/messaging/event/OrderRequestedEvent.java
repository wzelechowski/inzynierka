package pizzeria.orders.order.messaging.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public record OrderRequestedEvent(
        @NotNull
        UUID orderId,

        @NotBlank
        String deliveryAddress,

        @NotBlank
        String deliveryCity,

        @NotBlank
        @Pattern(regexp = "\\d{2}-\\d{3}")
        String postalCode
) {
}
