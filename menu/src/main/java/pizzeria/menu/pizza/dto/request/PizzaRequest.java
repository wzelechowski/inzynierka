package pizzeria.menu.pizza.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import pizzeria.menu.pizza.dto.response.PizzaIngredientResponse;
import pizzeria.menu.pizza.model.PizzaSize;

import java.util.List;

public record PizzaRequest(
        @NotBlank
        @Size(min = 2, max = 30)
        String name,

        @NotNull
        PizzaSize pizzaSize,

        @NotEmpty
        List<PizzaIngredientRequest> ingredientList
){}
