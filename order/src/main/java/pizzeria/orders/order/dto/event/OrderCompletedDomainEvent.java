package pizzeria.orders.order.dto.event;

import pizzeria.orders.order.model.Order;

public record OrderCompletedDomainEvent(Order order) {
}
