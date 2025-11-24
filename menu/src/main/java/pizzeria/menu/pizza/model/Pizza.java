package pizzeria.menu.pizza.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "pizza")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Pizza {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "pizzaSize")
    private PizzaSize pizzaSize;

    @OneToMany(mappedBy = "pizza", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PizzaIngredient> ingredientList = new ArrayList<>();

}
