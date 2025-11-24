package pizzeria.menu.extra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.menu.extra.model.Extra;

import java.util.UUID;

@Repository
public interface ExtraRepository extends JpaRepository<Extra, UUID> {
}
