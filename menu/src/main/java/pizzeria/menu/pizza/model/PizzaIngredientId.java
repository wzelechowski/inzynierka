package pizzeria.menu.pizza.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PizzaIngredientId implements Serializable {
    private UUID pizzaId;
    private UUID ingredientId;
}
