package pizzeria.promotions.promotion.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import pizzeria.promotions.promotion.model.PromotionRule;

public record PromotionRequest(
        @NotBlank
        String name,

        @NotNull
        Integer priority,

        @NotNull
        PromotionRule promotionRule
) {
}
