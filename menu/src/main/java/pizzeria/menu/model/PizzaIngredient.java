package pizzeria.menu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pizza_ingredient")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PizzaIngredient {
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

    @Column(name = "quantity")
    private Double quantity;
}
