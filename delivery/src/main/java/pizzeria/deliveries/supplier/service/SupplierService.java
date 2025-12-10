package pizzeria.deliveries.supplier.service;

import pizzeria.deliveries.supplier.dto.request.SupplierPatchRequest;
import pizzeria.deliveries.supplier.dto.request.SupplierRequest;
import pizzeria.deliveries.supplier.dto.response.SupplierResponse;

import java.util.List;
import java.util.UUID;

public interface SupplierService {
    List<SupplierResponse> getAllSuppliers();

    SupplierResponse getSupplierById(UUID id);

    SupplierResponse save(SupplierRequest request);

    void delete(UUID id);

    SupplierResponse update(UUID id, SupplierRequest request);

    SupplierResponse patch(UUID id, SupplierPatchRequest request);
}
