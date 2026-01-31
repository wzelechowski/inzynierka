package pizzeria.promotions.promotion.dto.request;

import java.time.LocalDateTime;

public record PromotionPatchRequest(
        Boolean active,
        LocalDateTime endDate
) {
}
