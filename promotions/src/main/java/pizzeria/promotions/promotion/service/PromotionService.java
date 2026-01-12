package pizzeria.promotions.promotion.service;

import pizzeria.promotions.promotion.dto.request.PromotionCheckRequest;
import pizzeria.promotions.promotion.dto.request.PromotionPatchRequest;
import pizzeria.promotions.promotion.dto.request.PromotionRequest;
import pizzeria.promotions.promotion.dto.response.PromotionCheckResponse;
import pizzeria.promotions.promotion.dto.response.PromotionResponse;

import java.util.List;
import java.util.UUID;

public interface PromotionService {
    List<PromotionResponse> getAllPromotions();

    List<PromotionResponse> getActivePromotions();

    PromotionResponse getPromotionById(UUID id);

    PromotionResponse save(PromotionRequest request);

    void delete(UUID id);

    PromotionResponse update(UUID id, PromotionRequest request);

    PromotionResponse patch(UUID id, PromotionPatchRequest request);

    PromotionCheckResponse checkPromotion(PromotionCheckRequest request);
}
