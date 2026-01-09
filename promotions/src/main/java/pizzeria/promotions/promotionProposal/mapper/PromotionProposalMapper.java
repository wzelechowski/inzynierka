package pizzeria.promotions.promotionProposal.mapper;

import org.mapstruct.*;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalPatchRequest;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalRequest;
import pizzeria.promotions.promotionProposal.dto.response.PromotionProposalResponse;
import pizzeria.promotions.promotionProposal.model.PromotionProposal;
import pizzeria.promotions.promotionProposalProduct.mapper.PromotionProposalProductMapper;

@Mapper(componentModel = "spring", uses = PromotionProposalProductMapper.class)
public interface PromotionProposalMapper {
    PromotionProposalResponse toResponse(PromotionProposal promotionProposal);

    PromotionProposal toEntity(PromotionProposalRequest request);

    void updateEntity(@MappingTarget PromotionProposal promotionProposal,
                      PromotionProposalRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget PromotionProposal promotionProposal,
                     PromotionProposalPatchRequest request);

    @AfterMapping
    default void linkProducts(@MappingTarget PromotionProposal proposal) {
        if (proposal.getProducts() != null) {
            proposal.getProducts().forEach(product -> product.setProposal(proposal));
        }
    }
}
