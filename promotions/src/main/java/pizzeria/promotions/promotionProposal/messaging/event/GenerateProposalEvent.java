package pizzeria.promotions.promotionProposal.messaging.event;

public record GenerateProposalEvent(
        Integer maxProposals,
        Integer daysBack
) {
}
