package pizzeria.orders.client.promotion.dto;

import java.util.List;
import java.util.UUID;

public record PromotionCheckRequest(
        List<UUID> productIds
) {
}
