package pizzeria.orders.order.messaging.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record OrderStatusEvent(
        @NotNull
        UUID orderId,

        @NotBlank
        String status
) {
}
