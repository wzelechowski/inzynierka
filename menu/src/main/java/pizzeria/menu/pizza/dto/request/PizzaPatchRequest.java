package pizzeria.menu.pizza.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PizzaPatchRequest(
        @Size(min = 2, max = 30)
        String name,

        @Positive
        @Digits(integer = 3, fraction = 2)
        Double price,

        pizzeria.menu.common.model.enums.Size size
){}
