package pizzeria.promotions.promotionProposalProduct.dto.request;

import jakarta.validation.constraints.NotNull;
import pizzeria.promotions.promotionProposalProduct.model.ProposalProductRole;

import java.util.UUID;

public record PromotionProposalProductRequest(
        @NotNull
        UUID productId,

        @NotNull
        ProposalProductRole role
) {
}
