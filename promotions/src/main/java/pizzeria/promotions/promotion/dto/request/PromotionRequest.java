package pizzeria.promotions.promotion.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import pizzeria.promotions.promotionProposal.model.EffectType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PromotionRequest(
        @NotBlank
        String name,

        @NotNull
        LocalDateTime startDate,

        @NotNull
        LocalDateTime endDate,

        @NotNull
        BigDecimal discount,

        @NotNull
        EffectType effectType,

        @NotNull
        UUID proposalId
) {
}
