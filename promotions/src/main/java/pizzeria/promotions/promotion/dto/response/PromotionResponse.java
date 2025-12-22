package pizzeria.promotions.promotion.dto.response;

import pizzeria.promotions.promotion.model.PromotionRule;

import java.time.LocalDateTime;
import java.util.UUID;

public record PromotionResponse(
        UUID id,
        String name,
        Boolean active,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Integer priority,
        PromotionRule promotionRule
) {
}
