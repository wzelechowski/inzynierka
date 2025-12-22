package pizzeria.promotions.promotion.model;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class Conditions {
    private BigDecimal minOrderValue;
    private List<UUID> products;
}
