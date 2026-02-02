package pizzeria.promotions.promotion.dto.response;

import pizzeria.promotions.promotionProposal.dto.response.PromotionProposalResponse;
import pizzeria.promotions.promotionProposal.model.EffectType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PromotionResponse(
        UUID id,
        String name,
        Boolean active,
        LocalDateTime startDate,
        LocalDateTime endDate,
        BigDecimal discount,
        EffectType effectType,
        PromotionProposalResponse proposal,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
