package pizzeria.promotions.promotionProposal.messaging.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record PromotionProposedEvent(
        @NotEmpty
        List<UUID> antecedents,

        @NotEmpty
        List<UUID> consequents,

        @NotBlank
        String effectType,

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
