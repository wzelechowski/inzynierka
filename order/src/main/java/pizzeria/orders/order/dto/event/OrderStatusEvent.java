package pizzeria.orders.order.dto.event;

import java.util.UUID;

public record OrderStatusEvent(
        UUID orderId,
        String status
) {
}
