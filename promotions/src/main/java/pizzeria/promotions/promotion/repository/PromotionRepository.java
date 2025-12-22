package pizzeria.promotions.promotion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pizzeria.promotions.promotion.model.Promotion;

import java.util.UUID;

public interface PromotionRepository extends JpaRepository<Promotion, UUID> {
}
