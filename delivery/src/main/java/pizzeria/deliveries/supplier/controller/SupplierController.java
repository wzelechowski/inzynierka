package pizzeria.deliveries.supplier.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.deliveries.supplier.dto.request.SupplierChangeStatusRequest;
import pizzeria.deliveries.supplier.dto.request.SupplierPatchRequest;
import pizzeria.deliveries.supplier.dto.request.SupplierRequest;
import pizzeria.deliveries.supplier.dto.response.SupplierResponse;
import pizzeria.deliveries.supplier.service.SupplierService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping("")
    public ResponseEntity<List<SupplierResponse>> getAllSuppliers() {
        List<SupplierResponse> response = supplierService.getAllSuppliers();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getSupplierById(@PathVariable UUID id) {
        SupplierResponse response = supplierService.getSupplierById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/user")
    public ResponseEntity<SupplierResponse> getSupplierByUserId(@PathVariable UUID userId) {
        SupplierResponse response = supplierService.getSupplierByUserProfileId(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<SupplierResponse> createSupplier(@Valid @RequestBody SupplierRequest request) {
        SupplierResponse response = supplierService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SupplierResponse> deleteSupplierById(@PathVariable UUID id) {
        supplierService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> updateSupplierById(@PathVariable UUID id, @Valid @RequestBody SupplierRequest request) {
        SupplierResponse response = supplierService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SupplierResponse> patchSupplierById(@PathVariable UUID id, @Valid @RequestBody SupplierPatchRequest request) {
        SupplierResponse response = supplierService.patch(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SupplierResponse> changeSupplierStatus(@PathVariable UUID id, @Valid @RequestBody SupplierChangeStatusRequest request) {
        SupplierResponse response = supplierService.changeSupplierStatus(id, request);
        return ResponseEntity.ok(response);
    }
}
