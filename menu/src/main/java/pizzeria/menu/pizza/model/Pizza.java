package pizzeria.menu.pizza.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "pizzas")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Pizza {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Enumerated(EnumType.STRING)
    private PizzaSize pizzaSize;

    @OneToMany(mappedBy = "pizza", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PizzaIngredient> ingredientList = new ArrayList<>();

}
