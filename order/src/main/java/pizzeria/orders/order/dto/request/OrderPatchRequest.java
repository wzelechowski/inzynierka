package pizzeria.orders.order.dto.request;

import pizzeria.orders.order.model.OrderStatus;

import java.time.LocalDateTime;

public record OrderPatchRequest (
        OrderStatus status,
        LocalDateTime deliveredAt
) {}