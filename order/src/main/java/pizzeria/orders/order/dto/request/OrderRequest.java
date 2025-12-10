package pizzeria.orders.order.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import pizzeria.orders.order.model.OrderType;
import pizzeria.orders.orderItem.dto.request.OrderItemRequest;

import java.util.List;

public record OrderRequest(
        @NotNull
        OrderType type,

        @NotEmpty
        List<OrderItemRequest> orderItems
) {}
