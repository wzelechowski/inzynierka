package pizzeria.menu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.menu.model.Extra;

@Repository
public interface ExtraRepository extends JpaRepository<Extra, Long> {
}
