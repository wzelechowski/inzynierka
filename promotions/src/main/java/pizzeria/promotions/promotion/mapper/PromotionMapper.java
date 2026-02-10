package pizzeria.promotions.promotion.mapper;

import org.mapstruct.*;
import pizzeria.promotions.promotion.dto.request.PromotionPatchRequest;
import pizzeria.promotions.promotion.dto.request.PromotionRequest;
import pizzeria.promotions.promotion.dto.response.PromotionResponse;
import pizzeria.promotions.promotion.model.Promotion;
import pizzeria.promotions.promotionProposal.mapper.PromotionProposalMapper;

@Mapper(componentModel = "spring", uses = PromotionProposalMapper.class)
public interface PromotionMapper {
    PromotionResponse toResponse(Promotion promotion);

    Promotion toEntity(PromotionRequest request);

    void updateEntity(@MappingTarget Promotion promotion, PromotionRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget Promotion promotion, PromotionPatchRequest request);

    @AfterMapping
    default void linkProposal(@MappingTarget Promotion promotion) {
        if (promotion != null) {
            promotion.getProposal().setApproved(true);
        }
    }
}
