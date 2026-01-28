package pizzeria.orders.order.service;

import pizzeria.orders.order.dto.request.OrderDeliveryRequest;
import pizzeria.orders.order.dto.request.OrderPatchRequest;
import pizzeria.orders.order.dto.request.OrderRequest;
import pizzeria.orders.order.dto.response.OrderResponse;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    List<OrderResponse> getAllOrders(UUID userId, String roles);

    OrderResponse getOrderById(UUID orderId, UUID userId, String roles);

    UUID getOrderUserId(UUID orderId);

    OrderResponse save(OrderRequest request, UUID userId);

    OrderResponse save(OrderDeliveryRequest request, UUID userId);

    void delete(UUID orderId, UUID userId);

    OrderResponse update(UUID orderId, UUID userId, OrderRequest request);

    OrderResponse patch(UUID orderId, UUID userId, OrderPatchRequest request);
}
