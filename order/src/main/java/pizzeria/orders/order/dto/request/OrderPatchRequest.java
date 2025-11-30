package pizzeria.orders.order.dto.request;

import pizzeria.orders.order.model.OrderStatus;

import java.util.UUID;

public record OrderPatchRequest (
        UUID supplierId,
        OrderStatus orderStatus
) {}