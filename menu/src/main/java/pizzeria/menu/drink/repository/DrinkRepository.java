package pizzeria.menu.drink.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.menu.drink.model.Drink;

@Repository
public interface DrinkRepository extends JpaRepository<Drink, Long> {
}
