package pizzeria.orders.order.messaging.event;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderCompletedEvent(
        UUID orderId,
        UUID userId,

        @JsonFormat(shape = JsonFormat.Shape.STRING)
        LocalDateTime createdAt,

        BigDecimal totalPrice,
        List<UUID> orderItemsIds
) {
}
