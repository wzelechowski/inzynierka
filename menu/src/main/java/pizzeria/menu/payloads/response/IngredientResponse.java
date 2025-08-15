package pizzeria.menu.payloads.response;

public record IngredientResponse(
    Long id,
    String name,
    Double price
){}
