package pizzeria.promotions.promotionProposal.messaging.publisher;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import pizzeria.promotions.config.RabbitConfig;
import pizzeria.promotions.promotionProposal.messaging.event.GenerateProposalEvent;

@Service
@RequiredArgsConstructor
public class PromotionProposalEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishProposalGenerateRequest(GenerateProposalEvent event) {
     rabbitTemplate.convertAndSend(
             RabbitConfig.EXCHANGE,
             RabbitConfig.AI_ROUTING_KEY,
             event
     );
    }
}
