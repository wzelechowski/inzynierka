package pizzeria.promotions.promotion.dto;

import pizzeria.promotions.promotionProposal.model.EffectType;

import java.math.BigDecimal;
import java.util.UUID;

public record AppliedPromotion(
        UUID promotionId,
        UUID productId,
        EffectType effectType,
        BigDecimal discount
) {
}
