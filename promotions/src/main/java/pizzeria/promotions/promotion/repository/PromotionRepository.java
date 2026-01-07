package pizzeria.promotions.promotion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pizzeria.promotions.promotion.model.Promotion;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface PromotionRepository extends JpaRepository<Promotion, UUID> {
    List<Promotion> findByActiveTrueAndEndDateBefore(LocalDateTime time);
    List<Promotion> findByActive(Boolean active);
}
