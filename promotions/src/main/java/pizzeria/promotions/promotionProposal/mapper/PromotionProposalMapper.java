package pizzeria.promotions.promotionProposal.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
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
}
