package pizzeria.promotions.promotionProposal.dto.response;

import pizzeria.promotions.promotionProposal.model.EffectType;
import pizzeria.promotions.promotionProposalProduct.dto.response.PromotionProposalProductResponse;

import java.math.BigDecimal;
import java.util.List;

public record PromotionProposalResponse(
        EffectType effectType,
        BigDecimal support,
        BigDecimal confidence,
        BigDecimal lift,
        BigDecimal score,
        String reason,
        List<PromotionProposalProductResponse> products
) {
}
