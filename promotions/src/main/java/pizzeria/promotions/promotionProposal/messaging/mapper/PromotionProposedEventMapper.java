package pizzeria.promotions.promotionProposal.messaging.mapper;

import org.mapstruct.Mapper;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalRequest;
import pizzeria.promotions.promotionProposal.messaging.event.PromotionProposedEvent;

@Mapper(componentModel = "spring")
public interface PromotionProposedEventMapper {
    PromotionProposalRequest toRequest(PromotionProposedEvent event);
}
