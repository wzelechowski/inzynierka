package pizzeria.deliveries.deliveryZone.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pizzeria.deliveries.deliveryZone.dto.request.DeliveryZonePatchRequest;
import pizzeria.deliveries.deliveryZone.dto.request.DeliveryZoneRequest;
import pizzeria.deliveries.deliveryZone.dto.response.DeliveryZoneResponse;
import pizzeria.deliveries.deliveryZone.model.DeliveryZone;

@Mapper(componentModel = "spring")
public interface DeliveryZoneMapper {
    DeliveryZoneResponse toResponse(DeliveryZone deliveryZone);

    DeliveryZone toEntity(DeliveryZoneRequest request);

    void updateEntity(@MappingTarget DeliveryZone deliveryZone, DeliveryZoneRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget DeliveryZone deliveryZone, DeliveryZonePatchRequest request);
}
