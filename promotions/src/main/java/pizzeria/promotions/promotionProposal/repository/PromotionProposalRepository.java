package pizzeria.promotions.promotionProposal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.promotions.promotionProposal.model.PromotionProposal;

import java.util.UUID;

@Repository
public interface PromotionProposalRepository extends JpaRepository<PromotionProposal, UUID> {
}
