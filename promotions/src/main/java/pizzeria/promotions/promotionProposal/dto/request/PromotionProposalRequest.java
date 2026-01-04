package pizzeria.promotions.promotionProposal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import pizzeria.promotions.promotionProposal.model.EffectType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record PromotionProposalRequest(
        @NotEmpty
        List<UUID> antecedents,

        @NotEmpty
        List<UUID> consequents,

        @NotNull
        EffectType effectType,

        @NotNull
        BigDecimal support,

        @NotNull
        BigDecimal confidence,

        @NotNull
        BigDecimal lift,

        @NotNull
        BigDecimal score,

        @NotBlank
        String reason,

        @NotNull
        BigDecimal discount
) {
}
