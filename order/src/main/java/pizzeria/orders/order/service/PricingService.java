package pizzeria.orders.order.service;

import pizzeria.orders.order.model.Order;

public interface PricingService {
    void processOrderPricing(Order order);
}
