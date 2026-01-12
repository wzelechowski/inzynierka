package pizzeria.orders.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pizzeria.orders.client.menu.MenuItemClient;
import pizzeria.orders.client.menu.dto.MenuItemResponse;
import pizzeria.orders.client.promotion.dto.AppliedPromotion;
import pizzeria.orders.order.model.Order;
import pizzeria.orders.orderItem.model.OrderItem;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final DiscountService discountService;
    private final MenuItemClient menuItemClient;

    public void processOrderPricing(Order order) {
        List<OrderItem> orderItems = order.getOrderItems();
        Map<UUID, AppliedPromotion> orderPromotions = discountService.checkPromotions(orderItems);
        List<UUID> appliedPromotionIds = calculateOrderItemsPricesWithPromotions(orderItems, orderPromotions);
        linkToOrder(order, orderItems, appliedPromotionIds);
        calculateAndSetOrderTotalPrice(order);
    }

    private List<UUID> calculateOrderItemsPricesWithPromotions(List<OrderItem> orderItems, Map<UUID, AppliedPromotion> promotions) {
        List<OrderItem> discountedItems = new ArrayList<>();
        List<UUID> appliedPromotionIds = new ArrayList<>();
        for (OrderItem orderItem : orderItems) {
            MenuItemResponse menuItem = menuItemClient.getMenuItem(orderItem.getItemId());
            BigDecimal basePrice = menuItem.basePrice();
            orderItem.setBasePrice(menuItem.basePrice());
            orderItem.setFinalPrice(basePrice);
            orderItem.setTotalPrice(basePrice.multiply(BigDecimal.valueOf(orderItem.getQuantity())));
            AppliedPromotion promotion = promotions.get(orderItem.getItemId());
            if (promotion != null) {
                applyDiscount(promotion, orderItem, discountedItems);
                appliedPromotionIds.add(promotion.promotionId());
            }
        }

        if (!discountedItems.isEmpty()) {
            orderItems.addAll(discountedItems);
        }

        return appliedPromotionIds;
    }

    private void applyDiscount(AppliedPromotion promotion, OrderItem orderItem, List<OrderItem> discountedItems) {
        BigDecimal finalPrice = discountService.applyPromotion(orderItem.getBasePrice(), promotion);
        if (orderItem.getQuantity() > 1) {
            orderItem.setQuantity(orderItem.getQuantity() - 1);
            orderItem.setTotalPrice(orderItem.getFinalPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
            OrderItem discountedOrderItem = modelDiscountedOrderItem(orderItem, finalPrice);
            discountedItems.add(discountedOrderItem);
        } else {
            orderItem.setFinalPrice(finalPrice);
            orderItem.setTotalPrice(finalPrice);
            orderItem.setDiscounted(true);
        }
    }

    private OrderItem modelDiscountedOrderItem(OrderItem orderItem, BigDecimal finalPrice) {
        OrderItem discountedOrderItem = new OrderItem();
        discountedOrderItem.setItemId(orderItem.getItemId());
        discountedOrderItem.setQuantity(1);
        discountedOrderItem.setBasePrice(orderItem.getBasePrice());
        discountedOrderItem.setFinalPrice(finalPrice);
        discountedOrderItem.setTotalPrice(finalPrice);
        discountedOrderItem.setDiscounted(true);
        return discountedOrderItem;
    }

    private void linkToOrder(Order order, List<OrderItem> orderItems, List<UUID> appliedPromotionIds) {
        order.getPromotionIds().addAll(appliedPromotionIds);
        orderItems.forEach(orderItem -> orderItem.setOrder(order));
        order.setOrderItems(orderItems);
    }

    private void calculateAndSetOrderTotalPrice(Order order) {
        BigDecimal orderTotalPrice = order.getOrderItems()
                .stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalPrice(orderTotalPrice);
    }
}
