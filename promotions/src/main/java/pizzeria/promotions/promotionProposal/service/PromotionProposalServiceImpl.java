package pizzeria.promotions.promotionProposal.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalPatchRequest;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalRequest;
import pizzeria.promotions.promotionProposal.dto.response.PromotionProposalResponse;
import pizzeria.promotions.promotionProposal.mapper.PromotionProposalMapper;
import pizzeria.promotions.promotionProposal.messaging.event.GenerateProposalEvent;
import pizzeria.promotions.promotionProposal.messaging.publisher.PromotionProposalEventPublisher;
import pizzeria.promotions.promotionProposal.model.PromotionProposal;
import pizzeria.promotions.promotionProposal.repository.PromotionProposalRepository;
import pizzeria.promotions.promotionProposalProduct.model.ProposalProductRole;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionProposalServiceImpl implements PromotionProposalService {

    private final PromotionProposalRepository promotionProposalRepository;
    private final PromotionProposalMapper promotionProposalMapper;
    private final PromotionProposalEventPublisher eventPublisher;

    @Override
    public List<PromotionProposalResponse> getAllProposals() {
        return promotionProposalRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(PromotionProposal::getCreatedAt).reversed())
                .map(promotionProposalMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PromotionProposalResponse getProposalById(UUID id) {
        PromotionProposal promotionProposal = promotionProposalRepository.findById(id).orElseThrow(NotFoundException::new);
        return promotionProposalMapper.toResponse(promotionProposal);
    }

    @Override
    @Transactional
    public PromotionProposalResponse save(PromotionProposalRequest request) {
        PromotionProposal promotionProposal = promotionProposalMapper.toEntity(request);
        request.antecedents().forEach(id -> promotionProposal.addProduct(id, ProposalProductRole.ANTECEDENT));
        request.consequents().forEach(id -> promotionProposal.addProduct(id, ProposalProductRole.CONSEQUENT));
        PromotionProposal saved = promotionProposalRepository.saveAndFlush(promotionProposal);
        return promotionProposalMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        PromotionProposal promotionProposal = promotionProposalRepository.findById(id).orElseThrow(NotFoundException::new);
        promotionProposalRepository.delete(promotionProposal);
    }

    @Override
    @Transactional
    public PromotionProposalResponse update(UUID id, PromotionProposalRequest request) {
        PromotionProposal promotionProposal = promotionProposalRepository.findById(id).orElseThrow(NotFoundException::new);
        promotionProposalMapper.updateEntity(promotionProposal, request);
        return promotionProposalMapper.toResponse(promotionProposal);
    }

    @Override
    @Transactional
    public PromotionProposalResponse patch(UUID id, PromotionProposalPatchRequest request) {
        PromotionProposal promotionProposal = promotionProposalRepository.findById(id).orElseThrow(NotFoundException::new);
        promotionProposalMapper.patchEntity(promotionProposal, request);
        return promotionProposalMapper.toResponse(promotionProposal);
    }

    @Override
    public void generate(Integer maxProposals, Integer daysBack) {
        GenerateProposalEvent event = new GenerateProposalEvent(maxProposals, daysBack);
        eventPublisher.publishProposalGenerateRequest(event);
    }
}
