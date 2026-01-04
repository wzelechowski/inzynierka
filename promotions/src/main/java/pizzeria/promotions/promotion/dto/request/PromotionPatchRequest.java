package pizzeria.promotions.promotion.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PromotionPatchRequest(
        Boolean active,
        LocalDateTime endDate,
        BigDecimal discount
) {
}
