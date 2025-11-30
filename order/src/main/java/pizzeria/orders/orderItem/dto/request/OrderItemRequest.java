package pizzeria.orders.orderItem.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record OrderItemRequest(
        @NotNull
        UUID itemId,

        @NotNull
        Integer quantity
) {}
