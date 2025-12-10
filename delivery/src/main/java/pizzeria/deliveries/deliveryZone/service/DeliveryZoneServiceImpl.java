package pizzeria.deliveries.deliveryZone.service;

import jakarta.ws.rs.NotFoundException;
import org.springframework.stereotype.Service;
import pizzeria.deliveries.deliveryZone.dto.request.DeliveryZonePatchRequest;
import pizzeria.deliveries.deliveryZone.dto.request.DeliveryZoneRequest;
import pizzeria.deliveries.deliveryZone.dto.response.DeliveryZoneResponse;
import pizzeria.deliveries.deliveryZone.mapper.DeliveryZoneMapper;
import pizzeria.deliveries.deliveryZone.model.DeliveryZone;
import pizzeria.deliveries.deliveryZone.repository.DeliveryZoneRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeliveryZoneServiceImpl  implements DeliveryZoneService {
    private final DeliveryZoneRepository deliveryZoneRepository;
    private final DeliveryZoneMapper deliveryZoneMapper;

    public DeliveryZoneServiceImpl(DeliveryZoneRepository deliveryZoneRepository, DeliveryZoneMapper deliveryZoneMapper) {
        this.deliveryZoneRepository = deliveryZoneRepository;
        this.deliveryZoneMapper = deliveryZoneMapper;
    }

    @Override
    public List<DeliveryZoneResponse> getAllDeliveryZones() {
        return deliveryZoneRepository.findAll()
                .stream()
                .map(deliveryZoneMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DeliveryZoneResponse getDeliveryZone(UUID id) {
        DeliveryZone deliveryZone = deliveryZoneRepository.findById(id).orElseThrow(NotFoundException::new);
        return deliveryZoneMapper.toResponse(deliveryZone);
    }

    @Override
    public DeliveryZoneResponse save(DeliveryZoneRequest request) {
        DeliveryZone deliveryZone = deliveryZoneMapper.toEntity(request);
        deliveryZoneRepository.save(deliveryZone);
        return deliveryZoneMapper.toResponse(deliveryZone);
    }

    @Override
    public void delete(UUID id) {
        deliveryZoneRepository.findById(id).orElseThrow(NotFoundException::new);
        deliveryZoneRepository.deleteById(id);
    }

    @Override
    public DeliveryZoneResponse update(UUID id, DeliveryZoneRequest request) {
        DeliveryZone deliveryZone = deliveryZoneRepository.findById(id).orElseThrow(NotFoundException::new);
        deliveryZoneMapper.updateEntity(deliveryZone, request);
        deliveryZoneRepository.save(deliveryZone);
        return deliveryZoneMapper.toResponse(deliveryZone);
    }

    @Override
    public DeliveryZoneResponse patch(UUID id, DeliveryZonePatchRequest request) {
        DeliveryZone deliveryZone = deliveryZoneRepository.findById(id).orElseThrow(NotFoundException::new);
        deliveryZoneMapper.patchEntity(deliveryZone, request);
        deliveryZoneRepository.save(deliveryZone);
        return deliveryZoneMapper.toResponse(deliveryZone);
    }
}
