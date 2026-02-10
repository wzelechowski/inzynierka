package pizzeria.promotions.promotion.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pizzeria.promotions.promotionProposal.model.EffectType;
import pizzeria.promotions.promotionProposal.model.PromotionProposal;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "promotions")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Builder.Default
    private Boolean active = true;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal discount;
    
    @Enumerated(EnumType.STRING)
    private EffectType effectType;

    @OneToOne(
            optional = false,
            fetch = FetchType.LAZY,
            cascade = {CascadeType.MERGE, CascadeType.PERSIST}
    )
    @JoinColumn(name = "proposal_id", nullable = false)
    @Builder.Default
    private PromotionProposal proposal = null;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
