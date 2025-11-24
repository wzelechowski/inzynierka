package pizzeria.menu.pizza.dto.response;

import java.util.UUID;

public record PizzaIngredientResponse(
   UUID pizzaId,
   UUID ingredientId,
   Double quantity
) {}
