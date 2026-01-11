package pizzeria.orders.order.messaging.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderCompletedEvent(
        @NotNull
        UUID orderId,

        @NotNull
        UUID userId,

        @JsonFormat(shape = JsonFormat.Shape.STRING)
        LocalDateTime createdAt,

        @NotNull
        BigDecimal totalPrice,

        @NotEmpty
        List<UUID> orderItemsIds
) {
}
