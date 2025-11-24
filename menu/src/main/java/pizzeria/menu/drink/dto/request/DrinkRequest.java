package pizzeria.menu.drink.dto.request;

import jakarta.validation.constraints.*;

public record DrinkRequest(
        @NotBlank
        @Size(min = 2, max = 30)
        String name,

        @NotNull
        @Positive
        @Digits(integer = 1, fraction = 2)
        Double volume
){}
