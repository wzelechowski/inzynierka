package pizzeria.deliveries.delivery.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.deliveries.delivery.dto.request.DeliveryChangeStatusRequest;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.dto.request.DeliverySupplierAssignRequest;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;
import pizzeria.deliveries.delivery.service.DeliveryService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/")
public class DeliveryController {
    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("")
    public ResponseEntity<List<DeliveryResponse>> getAllDeliveries(@RequestParam(required = false) UUID supplierId) {
        List<DeliveryResponse> response = deliveryService.getAllDeliveries(supplierId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<DeliveryResponse>> getAllPendingDeliveries() {
        List<DeliveryResponse> response = deliveryService.getPendingDeliveries();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryResponse> getDelivery(@PathVariable UUID id) {
        DeliveryResponse response = deliveryService.getDeliveryById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<DeliveryResponse> getDeliveryByOrderId(@PathVariable UUID orderId) {
        DeliveryResponse response = deliveryService.getDeliveryByOrderId(orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<DeliveryResponse> addDelivery(@Valid @RequestBody DeliveryRequest request) {
        DeliveryResponse response = deliveryService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeliveryResponse> deleteDelivery(@PathVariable UUID id) {
        deliveryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryResponse> updateDelivery(@PathVariable UUID id, @Valid @RequestBody DeliveryRequest request) {
        DeliveryResponse response = deliveryService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryResponse> patchDelivery(@PathVariable UUID id, @Valid @RequestBody DeliveryChangeStatusRequest request) {
        DeliveryResponse response = deliveryService.changeStatus(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/supplier")
    public ResponseEntity<DeliveryResponse> updateSupplier(@PathVariable UUID id, @Valid @RequestBody DeliverySupplierAssignRequest request) {
        DeliveryResponse response = deliveryService.assignSupplier(id, request);
        return ResponseEntity.ok(response);
    }
}
