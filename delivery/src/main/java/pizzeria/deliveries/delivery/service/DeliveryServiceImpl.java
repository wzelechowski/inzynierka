package pizzeria.deliveries.delivery.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.deliveries.delivery.messaging.event.DeliveryStatusEvent;
import pizzeria.deliveries.delivery.dto.request.DeliveryPatchRequest;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;
import pizzeria.deliveries.delivery.mapper.DeliveryMapper;
import pizzeria.deliveries.delivery.model.Delivery;
import pizzeria.deliveries.delivery.messaging.publisher.DeliveryEventPublisher;
import pizzeria.deliveries.delivery.model.DeliveryStatus;
import pizzeria.deliveries.delivery.repository.DeliveryRepository;
import pizzeria.deliveries.delivery.validator.DeliveryStatusValidator;
import pizzeria.deliveries.supplier.repository.SupplierRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper deliveryMapper;
    private final SupplierRepository supplierRepository;
    private final DeliveryStatusValidator deliveryStatusValidator;
    private final DeliveryEventPublisher deliveryEventPublisher;

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
    public DeliveryResponse patch(UUID id, DeliveryPatchRequest request) {
        Delivery delivery = deliveryRepository.findById(id).orElseThrow(NotFoundException::new);
        if (request.status() != null) {
            if (request.status() != DeliveryStatus.CANCELLED) {
                if (request.supplierId() == null && delivery.getSupplier() == null) {
                    throw new IllegalArgumentException("Cannot change delivery status without supplier");
                }
            }

            deliveryStatusValidator.validate(delivery.getStatus(), request.status());
            delivery.setStatus(request.status());
            var event = new DeliveryStatusEvent(delivery.getOrderId(), request.status());
            deliveryEventPublisher.publishDeliveryStatus(event);
        }

        deliveryMapper.patchEntity(delivery, request);
        deliveryRepository.save(delivery);
        return deliveryMapper.toResponse(delivery);
    }
}
