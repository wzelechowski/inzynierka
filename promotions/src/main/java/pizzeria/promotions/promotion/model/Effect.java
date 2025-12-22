package pizzeria.promotions.promotion.model;

import lombok.Data;

@Data
public class Effect {
    private EffectType type;
    private Integer value;
}
