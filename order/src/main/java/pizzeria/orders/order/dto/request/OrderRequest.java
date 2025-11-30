package pizzeria.orders.order.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import pizzeria.orders.orderItem.dto.request.OrderItemRequest;

import java.util.List;
import java.util.UUID;

public record OrderRequest(
        @NotNull
        UUID supplierId,

        @NotEmpty
        List<OrderItemRequest> orderItems
) {}
