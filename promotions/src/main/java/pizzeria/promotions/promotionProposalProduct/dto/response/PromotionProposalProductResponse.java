package pizzeria.promotions.promotionProposalProduct.dto.response;

import pizzeria.promotions.promotionProposalProduct.model.ProposalProductRole;

import java.util.UUID;

public record PromotionProposalProductResponse(
        UUID proposalId,
        UUID productId,
        ProposalProductRole role
) {
}
