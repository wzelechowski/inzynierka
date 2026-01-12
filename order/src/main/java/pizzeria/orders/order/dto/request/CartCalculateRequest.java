package pizzeria.orders.order.dto.request;

import jakarta.validation.constraints.NotEmpty;
import pizzeria.orders.orderItem.dto.request.OrderItemRequest;

import java.util.List;

public record CartCalculateRequest(
        @NotEmpty
        List<OrderItemRequest> orderItems
) {
}
