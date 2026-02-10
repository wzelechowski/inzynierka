package pizzeria.promotions.promotionProposal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pizzeria.promotions.promotionProposalProduct.model.PromotionProposalProduct;
import pizzeria.promotions.promotionProposalProduct.model.ProposalProductRole;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Table(name = "promotion_proposals")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PromotionProposal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private EffectType effectType;

    private BigDecimal support;
    private BigDecimal confidence;
    private BigDecimal lift;
    private BigDecimal score;
    private String reason;
    private BigDecimal discount;

    @Builder.Default
    private Boolean approved = false;

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    List<PromotionProposalProduct> products = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void addProduct(UUID id, ProposalProductRole role) {
        PromotionProposalProduct product = PromotionProposalProduct.builder()
                .proposal(this)
                .productId(id)
                .role(role)
                .build();

        products.add(product);
    }
}
