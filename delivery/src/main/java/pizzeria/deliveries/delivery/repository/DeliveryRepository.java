package pizzeria.deliveries.delivery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;
import pizzeria.deliveries.delivery.model.Delivery;
import pizzeria.deliveries.delivery.model.DeliveryStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
    List<Delivery> findAllBySupplierId(UUID supplierId);

    List<Delivery> findDeliveriesByStatus(DeliveryStatus status);

    Optional<Delivery> findDeliveryByOrderId(UUID orderId);
}
