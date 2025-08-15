package pizzeria.menu.payloads.response;

public record PizzaIngredientResponse(
   Long pizzaId,
   Long ingredientId,
   Double quantity
) {}
