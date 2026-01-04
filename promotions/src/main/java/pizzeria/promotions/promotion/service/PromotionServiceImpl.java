package pizzeria.promotions.promotion.service;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.promotions.promotion.dto.request.PromotionPatchRequest;
import pizzeria.promotions.promotion.dto.request.PromotionRequest;
import pizzeria.promotions.promotion.dto.response.PromotionResponse;
import pizzeria.promotions.promotion.mapper.PromotionMapper;
import pizzeria.promotions.promotion.model.Promotion;
import pizzeria.promotions.promotion.repository.PromotionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {
    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;


    @Override
    public List<PromotionResponse> getAllPromotions() {
        return promotionRepository.findAll()
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
        promotion.getProposal().setApproved(true);
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
        if (request.endDate().isBefore(promotion.getStartDate())) {
            throw new BadRequestException("End date can't be after start date");
        }

        if (request.endDate().isBefore(promotion.getEndDate())) {
            promotion.setActive(false);
        }

        promotionMapper.patchEntity(promotion, request);
        return promotionMapper.toResponse(promotion);
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void deactivateExpiredPromotions() {
        List<Promotion> expired = promotionRepository.findByActiveTrueAndEndDateBefore(LocalDateTime.now());
        expired.forEach(promotion -> promotion.setActive(false));
    }
}
