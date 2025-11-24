package pizzeria.menu.menuItem.dto.request;

import jakarta.validation.constraints.*;
import pizzeria.menu.menuItem.model.ItemType;

import java.math.BigDecimal;
import java.util.UUID;

public record MenuItemRequest(
        @NotNull
        UUID itemId,

        @NotNull
        ItemType type,

        @NotBlank
        @Size(min = 2, max = 30)
        String name,

        @NotBlank
        @Size(min = 2, max = 255)
        String description,

        @NotNull
        @Positive
        @Digits(integer = 3, fraction = 2)
        BigDecimal basePrice,

        @NotNull
        Boolean isAvailable
) {}
