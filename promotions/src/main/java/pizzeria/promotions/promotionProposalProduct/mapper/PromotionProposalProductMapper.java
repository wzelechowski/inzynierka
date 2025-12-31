package pizzeria.promotions.promotionProposalProduct.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import pizzeria.promotions.promotionProposalProduct.dto.request.PromotionProposalProductRequest;
import pizzeria.promotions.promotionProposalProduct.dto.response.PromotionProposalProductResponse;
import pizzeria.promotions.promotionProposalProduct.model.PromotionProposalProduct;

@Mapper(componentModel = "spring")
public interface PromotionProposalProductMapper {
    @Mapping(target = "proposalId", source = "proposal.id")
    PromotionProposalProductResponse toResponse(PromotionProposalProduct promotionProposalProduct);

    PromotionProposalProduct toEntity(PromotionProposalProductRequest request);
}
