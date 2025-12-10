package pizzeria.deliveries.delivery.service;

import pizzeria.deliveries.delivery.dto.request.DeliveryPatchRequest;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;

import java.util.List;
import java.util.UUID;

public interface DeliveryService {
    List<DeliveryResponse> getAllDeliveries();

    DeliveryResponse getDeliveryById(UUID id);

    DeliveryResponse save(DeliveryRequest request);

    void delete(UUID id);

    DeliveryResponse update(UUID id, DeliveryRequest request);

    DeliveryResponse patch(UUID id, DeliveryPatchRequest request);
}
