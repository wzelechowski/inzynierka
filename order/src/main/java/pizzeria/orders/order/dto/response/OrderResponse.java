package pizzeria.orders.order.dto.response;

import pizzeria.orders.order.model.OrderStatus;
import pizzeria.orders.orderItem.dto.response.OrderItemResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        OrderStatus status,
        BigDecimal totalPrice,
        LocalDateTime createdAt,
        LocalDateTime deliveredAt,
        List<OrderItemResponse> orderItems
) {}
