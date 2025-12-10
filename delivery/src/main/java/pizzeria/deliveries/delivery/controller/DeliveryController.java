package pizzeria.deliveries.delivery.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.deliveries.delivery.dto.request.DeliveryPatchRequest;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;
import pizzeria.deliveries.delivery.service.DeliveryService;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/delivery")
public class DeliveryController {
    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("")
    public ResponseEntity<List<DeliveryResponse>> getAllDeliveries() {
        List<DeliveryResponse> response = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryResponse> getDelivery(@PathVariable UUID id) {
        DeliveryResponse response = deliveryService.getDeliveryById(id);
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

    @PatchMapping("/{id}")
    public ResponseEntity<DeliveryResponse> patchDelivery(@PathVariable UUID id, @Valid @RequestBody DeliveryPatchRequest request) {
        DeliveryResponse response = deliveryService.patch(id, request);
        return ResponseEntity.ok(response);
    }
}
