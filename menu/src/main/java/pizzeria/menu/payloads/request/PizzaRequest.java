package pizzeria.menu.payloads.request;

import jakarta.validation.constraints.*;

public record PizzaRequest(
        @NotBlank
        @Size(min = 2, max = 30)
        String name,

        @NotNull
        @Positive
        @Digits(integer = 3, fraction = 2)
        Double price,

        @NotNull
        pizzeria.menu.model.Size size
){}
