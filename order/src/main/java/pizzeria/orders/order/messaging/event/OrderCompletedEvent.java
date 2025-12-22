package pizzeria.orders.order.messaging.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderCompletedEvent(
        UUID orderId,
        UUID userId,
        LocalDateTime createdAt,
        BigDecimal totalPrice,
        List<UUID> products
) {
}
