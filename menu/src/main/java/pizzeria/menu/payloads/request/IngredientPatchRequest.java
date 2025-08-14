package pizzeria.menu.payloads.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class IngredientPatchRequest {
    @Size(min = 1, max = 30)
    private String name;

    @Positive
    @Digits(integer = 3, fraction = 2)
    private Double price;
}
