package pizzeria.orders.order.dto.response;

import pizzeria.orders.orderItem.dto.response.OrderItemResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CartCalculateResponse(
        BigDecimal totalPrice,
        List<OrderItemResponse> orderItems,
        List<UUID> promotionIds
) {
}
