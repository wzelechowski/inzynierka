package pizzeria.deliveries.deliveryZone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.deliveries.deliveryZone.model.DeliveryZone;

import java.util.UUID;

@Repository
public interface DeliveryZoneRepository extends JpaRepository<DeliveryZone, UUID> {
}
