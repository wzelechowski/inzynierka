package pizzeria.orders.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pizzeria.orders.client.promotion.PromotionClient;
import pizzeria.orders.client.promotion.dto.AppliedPromotion;
import pizzeria.orders.client.promotion.dto.PromotionCheckResponse;
import pizzeria.orders.orderItem.model.OrderItem;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {

    private final PromotionClient promotionClient;

    public Map<UUID, AppliedPromotion> checkPromotions(List<OrderItem> orderItems) {
        List<AppliedPromotion> promotions = getOrderPromotions(orderItems);
        Map<UUID, List<AppliedPromotion>> promotionsByProduct = promotions.stream()
                .collect(Collectors.groupingBy(AppliedPromotion::productId));
        Map<UUID, AppliedPromotion> bestPromotionsMap = new HashMap<>();
        for (OrderItem orderItem : orderItems) {
            List<AppliedPromotion> itemPromotions = promotionsByProduct.get(orderItem.getItemId());
            if (itemPromotions != null && !itemPromotions.isEmpty()) {
                AppliedPromotion bestPromotion = getBestPromotion(itemPromotions, orderItem);
                if (bestPromotion != null) {
                    bestPromotionsMap.put(orderItem.getItemId(), bestPromotion);
                }
            }
        }

        return bestPromotionsMap;
    }

    private List<AppliedPromotion> getOrderPromotions(List<OrderItem> orderItems) {
        List<UUID> orderItemIds = orderItems
                .stream()
                .map(OrderItem::getItemId)
                .toList();

        PromotionCheckResponse promotionCheckResponse = promotionClient.checkPromotion(orderItemIds);

        return promotionCheckResponse.appliedPromotions()
                .stream()
                .toList();
    }

    private AppliedPromotion getBestPromotion(List<AppliedPromotion> promotions, OrderItem orderItem) {
        return promotions.stream()
                .min(Comparator.comparing(
                        p -> applyPromotion(orderItem.getBasePrice(), p)
                ))
                .orElse(null);
    }

    public BigDecimal applyPromotion(BigDecimal basePrice, AppliedPromotion promotion) {
        BigDecimal result;
        switch (promotion.effectType()) {
            case PERCENT -> {
                BigDecimal multiplier = BigDecimal.ONE.subtract(promotion.discount());
                result = basePrice.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
            }

            case FIXED -> result = basePrice.subtract(promotion.discount());
            case FREE_PRODUCT -> result = BigDecimal.ZERO;
            default -> throw new IllegalArgumentException("Unsupported promotion type: " + promotion.effectType());
        }

        return result.max(BigDecimal.ZERO);
    }
}
