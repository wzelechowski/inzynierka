package pizzeria.deliveries.deliveryZone.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.deliveries.deliveryZone.dto.request.DeliveryZonePatchRequest;
import pizzeria.deliveries.deliveryZone.dto.request.DeliveryZoneRequest;
import pizzeria.deliveries.deliveryZone.dto.response.DeliveryZoneResponse;
import pizzeria.deliveries.deliveryZone.service.DeliveryZoneService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/deliveryZone")
public class DeliveryZoneController {
    private final DeliveryZoneService deliveryZoneService;

    public DeliveryZoneController(DeliveryZoneService deliveryZoneService) {
        this.deliveryZoneService = deliveryZoneService;
    }

    @GetMapping("")
    public ResponseEntity<List<DeliveryZoneResponse>> getAllDeliveryZones() {
        List<DeliveryZoneResponse> deliveryZones = deliveryZoneService.getAllDeliveryZones();
        return ResponseEntity.ok().body(deliveryZones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryZoneResponse> getDeliveryZone(@PathVariable UUID id) {
        DeliveryZoneResponse deliveryZone = deliveryZoneService.getDeliveryZone(id);
        return ResponseEntity.ok().body(deliveryZone);
    }

    @PostMapping("")
    public ResponseEntity<DeliveryZoneResponse> createDeliveryZone(@Valid @RequestBody DeliveryZoneRequest request) {
        DeliveryZoneResponse response = deliveryZoneService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeliveryZoneResponse> deleteDeliveryZone(@PathVariable UUID id) {
        deliveryZoneService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryZoneResponse> updateDeliveryZone(@PathVariable UUID id, @Valid @RequestBody DeliveryZoneRequest request) {
        DeliveryZoneResponse response = deliveryZoneService.update(id, request);
        return ResponseEntity.ok().body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DeliveryZoneResponse> patchDeliveryZone(@PathVariable UUID id, @Valid @RequestBody DeliveryZonePatchRequest request) {
        DeliveryZoneResponse response = deliveryZoneService.patch(id, request);
        return ResponseEntity.ok().body(response);
    }
}
