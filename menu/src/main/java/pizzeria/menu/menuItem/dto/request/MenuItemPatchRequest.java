package pizzeria.menu.menuItem.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record MenuItemPatchRequest(
        @Size(min = 2, max = 30)
        String name,

        @Size(min = 2, max = 255)
        String description,

        @Positive
        @Digits(integer = 3, fraction = 2)
        BigDecimal basePrice,

        Boolean isAvailable
) {}
