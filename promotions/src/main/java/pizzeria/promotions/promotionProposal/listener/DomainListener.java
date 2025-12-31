package pizzeria.promotions.promotionProposal.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import pizzeria.promotions.promotionProposal.dto.event.ProposalApprovedEvent;
import pizzeria.promotions.promotionProposal.messaging.publisher.PromotionEventPublisher;

@Component
@RequiredArgsConstructor
public class DomainListener {

    private final PromotionEventPublisher promotionEventPublisher;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onProposalApproved(ProposalApprovedEvent domainEvent) {
    }
}
