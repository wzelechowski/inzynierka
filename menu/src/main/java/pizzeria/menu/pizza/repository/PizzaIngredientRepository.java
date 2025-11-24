package pizzeria.menu.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.menu.pizza.model.PizzaIngredient;

import java.util.UUID;

@Repository
public interface PizzaIngredientRepository extends JpaRepository<PizzaIngredient, UUID> {
}
