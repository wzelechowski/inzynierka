package pizzeria.deliveries.delivery.mapper;

import org.mapstruct.*;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.dto.response.DeliveryResponse;
import pizzeria.deliveries.delivery.model.Delivery;
import pizzeria.deliveries.supplier.mapper.SupplierMapper;

@Mapper(componentModel = "spring", uses = SupplierMapper.class)
public interface DeliveryMapper {
    DeliveryResponse toResponse(Delivery delivery);

    Delivery toEntity(DeliveryRequest request);

    void updateEntity(@MappingTarget Delivery delivery, DeliveryRequest request);

//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    void patchEntity(@MappingTarget Delivery delivery, DeliveryPatchRequest request);
}
