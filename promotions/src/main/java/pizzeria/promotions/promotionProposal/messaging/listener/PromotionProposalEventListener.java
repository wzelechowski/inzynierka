package pizzeria.promotions.promotionProposal.messaging.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pizzeria.promotions.config.RabbitConfig;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalRequest;
import pizzeria.promotions.promotionProposal.messaging.mapper.PromotionProposedEventMapper;
import pizzeria.promotions.promotionProposal.messaging.event.PromotionProposedEvent;
import pizzeria.promotions.promotionProposal.service.PromotionProposalService;

@Service
@RequiredArgsConstructor
public class PromotionProposalEventListener {

    private final PromotionProposalService promotionProposalService;
    private final PromotionProposedEventMapper promotionProposedEventMapper;

    @RabbitListener(queues = RabbitConfig.PROMOTION_QUEUE)
    public void onPromotionProposed(PromotionProposedEvent event) {
        PromotionProposalRequest request = promotionProposedEventMapper.toRequest(event);
        promotionProposalService.save(request);
    }
}
