package pizzeria.deliveries.delivery.service;

import jakarta.ws.rs.NotFoundException;
import org.springframework.stereotype.Service;
import pizzeria.deliveries.delivery.dto.request.DeliveryPatchRequest;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;
import pizzeria.deliveries.delivery.mapper.DeliveryMapper;
import pizzeria.deliveries.delivery.model.Delivery;
import pizzeria.deliveries.delivery.repository.DeliveryRepository;
import pizzeria.deliveries.supplier.mapper.SupplierMapper;
import pizzeria.deliveries.supplier.model.Supplier;
import pizzeria.deliveries.supplier.repository.SupplierRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeliveryServiceImpl implements DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper deliveryMapper;
    private final SupplierRepository supplierRepository;

    public DeliveryServiceImpl(DeliveryRepository deliveryRepository, DeliveryMapper deliveryMapper, SupplierRepository supplierRepository) {
        this.deliveryRepository = deliveryRepository;
        this.deliveryMapper = deliveryMapper;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAll()
                .stream()
                .map(deliveryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DeliveryResponse getDeliveryById(UUID id) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        return deliveryMapper.toResponse(delivery);
    }

    @Override
    public DeliveryResponse save(DeliveryRequest request) {
        Supplier supplier = supplierRepository.findById(request.supplierId()).orElseThrow(NotFoundException::new);
        Delivery delivery = deliveryMapper.toEntity(request);
        delivery.setSupplier(supplier);
        deliveryRepository.save(delivery);
        return deliveryMapper.toResponse(delivery);
    }

    @Override
    public void delete(UUID id) {
        Delivery delivery =  deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        deliveryRepository.delete(delivery);
    }

    @Override
    public DeliveryResponse update(UUID id, DeliveryRequest request) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        deliveryMapper.updateEntity(delivery, request);
        return deliveryMapper.toResponse(delivery);
    }

    @Override
    public DeliveryResponse patch(UUID id, DeliveryPatchRequest request) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        deliveryMapper.patchEntity(delivery, request);
        return deliveryMapper.toResponse(delivery);
    }
}
