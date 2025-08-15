package pizzeria.menu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.menu.model.PizzaIngredient;

@Repository
public interface PizzaIngredientRepository extends JpaRepository<PizzaIngredient, Long> {
}
