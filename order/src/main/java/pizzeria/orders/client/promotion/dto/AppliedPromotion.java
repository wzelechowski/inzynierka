package pizzeria.orders.client.promotion.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record AppliedPromotion(
        UUID promotionId,
        UUID productId,
        EffectType effectType,
        BigDecimal discount
) {
}
