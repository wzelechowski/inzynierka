package pizzeria.promotions.promotion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pizzeria.promotions.promotionProposal.model.EffectType;
import pizzeria.promotions.promotionProposal.model.PromotionProposal;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "promotions")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
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
    @JoinColumn(name = "proposal_id", nullable = false, unique = true)
    @Builder.Default
    private PromotionProposal proposal = null;
}
