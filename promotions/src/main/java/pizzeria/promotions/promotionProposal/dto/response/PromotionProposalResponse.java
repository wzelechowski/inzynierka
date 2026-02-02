package pizzeria.promotions.promotionProposal.dto.response;

import pizzeria.promotions.promotionProposal.model.EffectType;
import pizzeria.promotions.promotionProposalProduct.dto.response.PromotionProposalProductResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PromotionProposalResponse(
        UUID id,
        EffectType effectType,
        BigDecimal support,
        BigDecimal confidence,
        BigDecimal lift,
        BigDecimal score,
        String reason,
        BigDecimal discount,
        List<PromotionProposalProductResponse> products,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
