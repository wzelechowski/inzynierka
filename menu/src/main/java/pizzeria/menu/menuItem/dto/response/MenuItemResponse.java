package pizzeria.menu.menuItem.dto.response;

import pizzeria.menu.menuItem.model.ItemType;

import java.math.BigDecimal;
import java.util.UUID;

public record MenuItemResponse(
        UUID id,
        UUID itemId,
        ItemType type,
        String name,
        String description,
        BigDecimal basePrice,
        Boolean isAvailable
) {}
