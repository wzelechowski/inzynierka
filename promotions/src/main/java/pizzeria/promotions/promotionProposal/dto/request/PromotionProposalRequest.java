package pizzeria.promotions.promotionProposal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import pizzeria.promotions.promotionProposal.model.EffectType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record PromotionProposalRequest(
        @NotNull
        List<UUID> antecedents,

        @NotNull
        List<UUID> consequents,

        EffectType effectType,
        BigDecimal support,
        BigDecimal confidence,
        BigDecimal lift,
        BigDecimal score,
        String reason,

        @NotNull
        BigDecimal discount
) {
}
