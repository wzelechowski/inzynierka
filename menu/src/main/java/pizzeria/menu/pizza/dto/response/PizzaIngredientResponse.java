package pizzeria.menu.pizza.dto.response;

public record PizzaIngredientResponse(
   Long pizzaId,
   Long ingredientId,
   Double quantity
) {}
