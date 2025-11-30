package pizzeria.orders.client.menu.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record MenuItemResponse(
        UUID itemId,
        Integer quantity,
        BigDecimal basePrice,
        String name
) {}
