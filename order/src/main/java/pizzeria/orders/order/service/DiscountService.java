package pizzeria.orders.order.service;

import pizzeria.orders.client.promotion.dto.AppliedPromotion;
import pizzeria.orders.orderItem.model.OrderItem;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface DiscountService {
    Map<UUID, AppliedPromotion> checkPromotions(List<OrderItem> orderItems);

    BigDecimal applyPromotion(BigDecimal basePrice, AppliedPromotion promotion);
}
