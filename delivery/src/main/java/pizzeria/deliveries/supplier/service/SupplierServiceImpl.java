package pizzeria.deliveries.supplier.service;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.deliveries.supplier.dto.request.SupplierChangeStatusRequest;
import pizzeria.deliveries.supplier.dto.request.SupplierPatchRequest;
import pizzeria.deliveries.supplier.dto.request.SupplierRequest;
import pizzeria.deliveries.supplier.dto.response.SupplierResponse;
import pizzeria.deliveries.supplier.mapper.SupplierMapper;
import pizzeria.deliveries.supplier.model.Supplier;
import pizzeria.deliveries.supplier.repository.SupplierRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    public SupplierServiceImpl(SupplierRepository supplierRepository, SupplierMapper supplierMapper) {
        this.supplierRepository = supplierRepository;
        this.supplierMapper = supplierMapper;
    }

    @Override
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(supplierMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierResponse getSupplierById(UUID id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(NotFoundException::new);
        return supplierMapper.toResponse(supplier);
    }

    @Override
    public SupplierResponse getSupplierByUserProfileId(UUID id) {
        Supplier supplier = supplierRepository.findByUserProfileId(id).orElseThrow(NotFoundException::new);
        return supplierMapper.toResponse(supplier);
    }

    @Override
    @Transactional
    public SupplierResponse save(SupplierRequest request) {
        Supplier supplier = supplierMapper.toEntity(request);
        supplierRepository.save(supplier);
        return supplierMapper.toResponse(supplier);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(NotFoundException::new);
        supplierRepository.delete(supplier);
    }

    @Override
    @Transactional
    public SupplierResponse update(UUID id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(NotFoundException::new);
        supplierMapper.updateEntity(supplier, request);
        return supplierMapper.toResponse(supplier);
    }

    @Override
    @Transactional
    public SupplierResponse patch(UUID id, SupplierPatchRequest request) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(NotFoundException::new);
        supplierMapper.patchEntity(supplier, request);
        return supplierMapper.toResponse(supplier);
    }

    @Override
    @Transactional
    public SupplierResponse changeSupplierStatus(UUID id, SupplierChangeStatusRequest request) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(NotFoundException::new);
        supplier.setStatus(request.status());
        return supplierMapper.toResponse(supplier);
    }
}
