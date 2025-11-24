package pizzeria.menu.ingredient.dto.response;

import java.util.UUID;

public record IngredientResponse(
    UUID id,
    String name,
    Double weight
){}
