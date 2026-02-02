package pizzeria.promotions.promotionProposal.service;

import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalPatchRequest;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalRequest;
import pizzeria.promotions.promotionProposal.dto.response.PromotionProposalResponse;

import java.util.List;
import java.util.UUID;

public interface PromotionProposalService {
    List<PromotionProposalResponse> getAllProposals();

    PromotionProposalResponse getProposalById(UUID id);

    PromotionProposalResponse save(PromotionProposalRequest request);

    void delete(UUID id);

    PromotionProposalResponse update(UUID id, PromotionProposalRequest request);

    PromotionProposalResponse patch(UUID id, PromotionProposalPatchRequest request);

    void generate(Integer maxProposals, Integer daysBack);
}
