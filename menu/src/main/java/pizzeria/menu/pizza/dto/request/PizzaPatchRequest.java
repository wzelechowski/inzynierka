package pizzeria.menu.pizza.dto.request;

import jakarta.validation.constraints.Size;
import pizzeria.menu.pizza.model.PizzaSize;

public record PizzaPatchRequest(
        @Size(min = 2, max = 30)
        String name,

        PizzaSize pizzaSize
){}
