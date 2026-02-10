package pizzeria.promotions.promotion.service;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.promotions.promotion.dto.AppliedPromotion;
import pizzeria.promotions.promotion.dto.request.PromotionCheckRequest;
import pizzeria.promotions.promotion.dto.request.PromotionPatchRequest;
import pizzeria.promotions.promotion.dto.request.PromotionRequest;
import pizzeria.promotions.promotion.dto.response.PromotionCheckResponse;
import pizzeria.promotions.promotion.dto.response.PromotionResponse;
import pizzeria.promotions.promotion.mapper.PromotionMapper;
import pizzeria.promotions.promotion.model.Promotion;
import pizzeria.promotions.promotion.repository.PromotionRepository;
import pizzeria.promotions.promotionProposal.model.PromotionProposal;
import pizzeria.promotions.promotionProposal.repository.PromotionProposalRepository;
import pizzeria.promotions.promotionProposalProduct.model.PromotionProposalProduct;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static pizzeria.promotions.promotionProposalProduct.model.ProposalProductRole.ANTECEDENT;
import static pizzeria.promotions.promotionProposalProduct.model.ProposalProductRole.CONSEQUENT;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {
    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;
    private final PromotionProposalRepository promotionProposalRepository;


    @Override
    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Promotion::getCreatedAt).reversed())
                .map(promotionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PromotionResponse> getActivePromotions() {
        return promotionRepository.findByActive(true)
                .stream()
                .map(promotionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PromotionResponse getPromotionById(UUID id) {
        Promotion promotion = promotionRepository.findById(id).orElseThrow(NotFoundException::new);
        return promotionMapper.toResponse(promotion);
    }

    @Override
    @Transactional
    public PromotionResponse save(PromotionRequest request) {
        Promotion promotion = promotionMapper.toEntity(request);
        PromotionProposal proposal = promotionProposalRepository.findById(request.proposalId()).orElseThrow(NotFoundException::new);
        proposal.setApproved(true);
        promotion.setProposal(proposal);
        promotionRepository.save(promotion);
        return promotionMapper.toResponse(promotion);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Promotion promotion = promotionRepository.findById(id).orElseThrow(NotFoundException::new);
        promotionRepository.delete(promotion);
    }

    @Override
    @Transactional
    public PromotionResponse update(UUID id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id).orElseThrow(NotFoundException::new);
        promotionMapper.updateEntity(promotion, request);
        return promotionMapper.toResponse(promotion);
    }

    @Override
    @Transactional
    public PromotionResponse patch(UUID id, PromotionPatchRequest request) {
        Promotion promotion = promotionRepository.findById(id).orElseThrow(NotFoundException::new);
        if (request.endDate() != null) {
            if (request.endDate().isBefore(promotion.getStartDate())) {
                throw new BadRequestException("End date can't be after start date");
            }

            if (request.endDate().isBefore(LocalDateTime.now())) {
                promotion.setActive(false);
            }
        }

        promotionMapper.patchEntity(promotion, request);
        return promotionMapper.toResponse(promotion);
    }

    @Override
    public PromotionCheckResponse checkPromotion(PromotionCheckRequest request) {
        Set<UUID> orderProductids = new HashSet<>(request.productIds());
        List<Promotion> promotions = promotionRepository.findByActive(true);
        List<AppliedPromotion> appliedPromotions = new ArrayList<>();
        for (Promotion promotion : promotions) {
            Set<UUID> requiredProducts = promotion.getProposal().getProducts()
                    .stream()
                    .filter(product -> product.getRole() == ANTECEDENT)
                    .map(PromotionProposalProduct::getProductId)
                    .collect(Collectors.toSet());

            if (orderProductids.containsAll(requiredProducts)) {
                promotion.getProposal().getProducts()
                        .stream()
                        .filter(product -> product.getRole() == CONSEQUENT)
                        .map(PromotionProposalProduct::getProductId)
                                .filter(orderProductids::contains)
                                        .forEach(productId ->
                                                appliedPromotions.add(
                                                        new AppliedPromotion(
                                                                promotion.getId(),
                                                                productId,
                                                                promotion.getEffectType(),
                                                                promotion.getDiscount()
                                                        )
                                                ));

            }
        }

        return new PromotionCheckResponse(appliedPromotions);
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void deactivateExpiredPromotions() {
        List<Promotion> expired = promotionRepository.findByActiveTrueAndEndDateBefore(LocalDateTime.now());
        expired.forEach(promotion -> promotion.setActive(false));
    }
}
