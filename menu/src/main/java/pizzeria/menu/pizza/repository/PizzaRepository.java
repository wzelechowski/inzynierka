package pizzeria.menu.pizza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.menu.pizza.model.Pizza;

@Repository
public interface PizzaRepository extends JpaRepository<Pizza, Long> {
}
