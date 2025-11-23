package pizzeria.menu.pizza.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PizzaIngredientRequest(
        @NotNull
        Long pizzaId,

        @NotNull
        Long ingredientId,

        @NotNull
        @Positive
        @Digits(integer = 2, fraction = 2)
        Double quantity
) {}
