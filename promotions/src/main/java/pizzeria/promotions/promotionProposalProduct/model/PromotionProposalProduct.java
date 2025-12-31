package pizzeria.promotions.promotionProposalProduct.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pizzeria.promotions.promotionProposal.model.PromotionProposal;

import java.util.UUID;

@Table(name = "promotion_proposal_products")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PromotionProposalProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID productId;

    @Enumerated(EnumType.STRING)
    private ProposalProductRole role;

    @ManyToOne
    @JoinColumn(name = "proposal_id")
    private PromotionProposal proposal;
}
