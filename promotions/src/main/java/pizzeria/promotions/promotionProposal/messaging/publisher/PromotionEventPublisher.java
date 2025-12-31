package pizzeria.promotions.promotionProposal.messaging.publisher;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import pizzeria.promotions.config.RabbitConfig;
import pizzeria.promotions.promotionProposal.dto.event.ProposalApprovedEvent;

@Service
@RequiredArgsConstructor
public class PromotionEventPublisher {
    private final RabbitTemplate rabbitTemplate;
}
