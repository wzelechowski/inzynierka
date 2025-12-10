package pizzeria.deliveries.deliveryZone.service;

import pizzeria.deliveries.deliveryZone.dto.request.DeliveryZonePatchRequest;
import pizzeria.deliveries.deliveryZone.dto.request.DeliveryZoneRequest;
import pizzeria.deliveries.deliveryZone.dto.response.DeliveryZoneResponse;

import java.util.List;
import java.util.UUID;

public interface DeliveryZoneService {
    List<DeliveryZoneResponse> getAllDeliveryZones();

    DeliveryZoneResponse getDeliveryZone(UUID id);

    DeliveryZoneResponse save(DeliveryZoneRequest request);

    void delete(UUID id);

    DeliveryZoneResponse update(UUID id, DeliveryZoneRequest request);

    DeliveryZoneResponse patch(UUID id, DeliveryZonePatchRequest request);
}
