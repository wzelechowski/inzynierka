package pizzeria.menu.menuItem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pizzeria.menu.menuItem.model.MenuItem;

import java.util.List;
import java.util.UUID;

public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {
    List<MenuItem> findByIsAvailable(Boolean available);
}
