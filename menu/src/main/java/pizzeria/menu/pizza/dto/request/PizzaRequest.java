package pizzeria.menu.pizza.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import pizzeria.menu.pizza.model.PizzaSize;

public record PizzaRequest(
        @NotBlank
        @Size(min = 2, max = 30)
        String name,

        @NotNull
        PizzaSize pizzaSize
){}
