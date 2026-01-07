package pizzeria.orders.client.promotion.dto;

import java.util.List;

public record PromotionCheckResponse(
        List<AppliedPromotion> appliedPromotions
) {
}
