package pizzeria.orders.order.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.orders.order.dto.request.OrderDeliveryRequest;
import pizzeria.orders.order.dto.request.OrderPatchRequest;
import pizzeria.orders.order.dto.request.OrderRequest;
import pizzeria.orders.order.dto.response.OrderResponse;
import pizzeria.orders.order.model.OrderType;
import pizzeria.orders.order.service.OrderService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("")
    public ResponseEntity<List<OrderResponse>> getAllOrders(@RequestHeader("X-User-Id") UUID userId,
                                                            @RequestHeader("X-User-Roles") String roles) {
        List<OrderResponse> response = orderService.getAllOrders(userId, roles);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID orderId,
                                                      @RequestHeader("X-User-Id") UUID userId,
                                                      @RequestHeader("X-User-Roles") String roles) {
        OrderResponse response = orderService.getOrderById(orderId, userId, roles);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request, @RequestHeader("X-User-Id") UUID userId) {
        if (request.type() == OrderType.DELIVERY) {
            throw new IllegalArgumentException("Order type cannot be DELIVERY");
        }

        OrderResponse response = orderService.save(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/delivery")
    public ResponseEntity<OrderResponse> createDeliveryOrder(@Valid @RequestBody OrderDeliveryRequest request, @RequestHeader("X-User-Id") UUID userId) {
        if (request.type() != OrderType.DELIVERY) {
            throw new IllegalArgumentException("Order type have to be DELIVERY");
        }

        OrderResponse response = orderService.save(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<OrderResponse> deleteOrder(@PathVariable UUID orderId, @RequestHeader("X-User-Id") UUID userId) {
        orderService.delete(orderId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable UUID orderId,
                                                     @Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.update(orderId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{orderId}")
    public ResponseEntity<OrderResponse> patchOrder(@PathVariable UUID orderId,
                                                    @Valid @RequestBody OrderPatchRequest request) {
        OrderResponse response = orderService.patch(orderId, request);
        return ResponseEntity.ok(response);
    }
}
