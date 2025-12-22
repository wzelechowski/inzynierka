package pizzeria.promotions.promotion.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pizzeria.promotions.promotion.dto.request.PromotionPatchRequest;
import pizzeria.promotions.promotion.dto.request.PromotionRequest;
import pizzeria.promotions.promotion.dto.response.PromotionResponse;
import pizzeria.promotions.promotion.model.Promotion;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    PromotionResponse toResponse(Promotion promotion);

    Promotion toEntity(PromotionRequest request);

    void updateEntity(@MappingTarget Promotion promotion, PromotionRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget Promotion promotion, PromotionPatchRequest request);
}
