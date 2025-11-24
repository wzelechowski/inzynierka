package pizzeria.menu.ingredient.dto.request;

import jakarta.validation.constraints.*;

public record IngredientPatchRequest(
        @Size(min = 1, max = 30)
        String name,

        @Positive
        @Digits(integer = 3, fraction = 2)
        Double weight
){}
