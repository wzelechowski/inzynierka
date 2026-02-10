package pizzeria.deliveries.delivery.service;

import pizzeria.deliveries.delivery.dto.request.DeliveryChangeStatusRequest;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.dto.request.DeliverySupplierAssignRequest;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;

import java.util.List;
import java.util.UUID;

public interface DeliveryService {
    List<DeliveryResponse> getAllDeliveries(UUID supplierId);

    List<DeliveryResponse> getPendingDeliveries();

    DeliveryResponse getDeliveryById(UUID id);

    DeliveryResponse getDeliveryByOrderId(UUID orderId);

    DeliveryResponse save(DeliveryRequest request);

    void delete(UUID id);

    DeliveryResponse update(UUID id, DeliveryRequest request);

    DeliveryResponse changeStatus(UUID id, DeliveryChangeStatusRequest request);

    DeliveryResponse assignSupplier(UUID id, DeliverySupplierAssignRequest request);
}
