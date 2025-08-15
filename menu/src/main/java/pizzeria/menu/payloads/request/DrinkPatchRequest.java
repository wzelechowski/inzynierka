package pizzeria.menu.payloads.request;

import jakarta.validation.constraints.*;

public record DrinkPatchRequest(
    @Size(min = 2, max = 30)
    String name,

    @Positive
    @Digits(integer = 3, fraction = 2)
    Double price,

    @Positive
    @Digits(integer = 1, fraction = 2)
    Double volume
){}
