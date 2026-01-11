package pizzeria.orders.order.dto.event;

import jakarta.validation.constraints.NotNull;
import pizzeria.orders.order.model.Order;

public record OrderCompletedDomainEvent(
        @NotNull
        Order order
) {
}
