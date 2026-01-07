package pizzeria.promotions.promotion.dto.response;

import pizzeria.promotions.promotion.dto.AppliedPromotion;

import java.util.List;

public record PromotionCheckResponse(
        List<AppliedPromotion> appliedPromotions
) {
}
