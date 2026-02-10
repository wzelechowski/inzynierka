package pizzeria.menu.pizza.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pizzeria.menu.ingredient.model.Ingredient;

@Entity
@Table(name = "pizza_ingredients")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PizzaIngredient {
    @Builder.Default
    @EmbeddedId
    private PizzaIngredientId id = new PizzaIngredientId();

    @ManyToOne
    @MapsId("pizzaId")
    @JoinColumn(name = "pizza_id")
    private Pizza pizza;

    @ManyToOne
    @MapsId("ingredientId")
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    private Double quantity;
}
