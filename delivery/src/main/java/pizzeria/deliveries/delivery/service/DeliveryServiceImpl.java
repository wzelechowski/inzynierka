package pizzeria.deliveries.delivery.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.deliveries.delivery.dto.event.DeliveryStatusDomainEvent;
import pizzeria.deliveries.delivery.dto.request.DeliveryChangeStatusRequest;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.dto.request.DeliverySupplierAssignRequest;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;
import pizzeria.deliveries.delivery.mapper.DeliveryMapper;
import pizzeria.deliveries.delivery.model.Delivery;
import pizzeria.deliveries.delivery.model.DeliveryStatus;
import pizzeria.deliveries.delivery.repository.DeliveryRepository;
import pizzeria.deliveries.delivery.validator.DeliverySupplierAssignValidator;
import pizzeria.deliveries.supplier.model.Supplier;
import pizzeria.deliveries.supplier.repository.SupplierRepository;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper deliveryMapper;
    private final DeliverySupplierAssignValidator deliverySupplierAssignValidator;
    private final SupplierRepository supplierRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public List<DeliveryResponse> getAllDeliveries(UUID supplierId) {
        List<Delivery>  deliveries;
        if (supplierId != null) {
            deliveries = deliveryRepository.findAllBySupplierId(supplierId);
        } else {
            deliveries = deliveryRepository.findAll();
        }

        return deliveries.stream()
                .sorted(Comparator.comparing(Delivery::getAssignedAt, Comparator.nullsFirst(Comparator.reverseOrder())))
                .map(deliveryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeliveryResponse> getPendingDeliveries() {
        return deliveryRepository.findDeliveriesByStatus(DeliveryStatus.PENDING)
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
    public DeliveryResponse getDeliveryByOrderId(UUID orderId) {
        Delivery delivery = deliveryRepository.findDeliveryByOrderId(orderId).orElseThrow(NotFoundException::new);
        return deliveryMapper.toResponse(delivery);
    }

    @Override
    @Transactional
    public DeliveryResponse save(DeliveryRequest request) {
        Delivery delivery = deliveryMapper.toEntity(request);
        deliveryRepository.save(delivery);
        return deliveryMapper.toResponse(delivery);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Delivery delivery =  deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        deliveryRepository.delete(delivery);
    }

    @Override
    @Transactional
    public DeliveryResponse update(UUID id, DeliveryRequest request) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        deliveryMapper.updateEntity(delivery, request);
        return deliveryMapper.toResponse(delivery);
    }

    @Override
    @Transactional
    public DeliveryResponse changeStatus(UUID id, DeliveryChangeStatusRequest request) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        delivery.changeStatus(request.status());
        if (request.status() != DeliveryStatus.PENDING) {
            eventPublisher.publishEvent(new DeliveryStatusDomainEvent(delivery.getOrderId(), request.status()));
        }

        deliveryRepository.saveAndFlush(delivery);
        return deliveryMapper.toResponse(delivery);
    }

    @Override
    @Transactional
    public DeliveryResponse assignSupplier(UUID id, DeliverySupplierAssignRequest request) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        Supplier supplier = supplierRepository.findById(request.supplierId()).orElseThrow(NotFoundException::new);
        deliverySupplierAssignValidator.validate(delivery);
        delivery.assignSupplier(supplier);
        return deliveryMapper.toResponse(delivery);
    }
}
