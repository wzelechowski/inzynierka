package pizzeria.menu.drink.dto.request;

import jakarta.validation.constraints.*;

public record DrinkPatchRequest(
    @Size(min = 2, max = 30)
    String name,

    @Positive
    @Digits(integer = 1, fraction = 2)
    Double volume
){}
