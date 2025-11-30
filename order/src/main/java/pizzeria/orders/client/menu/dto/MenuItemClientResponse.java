package pizzeria.orders.client.menu.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record MenuItemClientResponse(
        UUID id,
        UUID itemId,
        String type,
        String name,
        String description,
        BigDecimal basePrice,
        Boolean isAvailable
) {}
