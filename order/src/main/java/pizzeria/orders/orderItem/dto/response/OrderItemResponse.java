package pizzeria.orders.orderItem.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(
        UUID orderId,
        UUID itemId,
        Integer quantity,
        BigDecimal basePrice,
        BigDecimal finalPrice,
        BigDecimal totalPrice,
        Boolean discounted
) {}
