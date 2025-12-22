package pizzeria.promotions.promotion.model;

import lombok.Data;

@Data
public class PromotionRule {
    private Integer version;
    private Conditions conditions;
    private Effect effect;
}
