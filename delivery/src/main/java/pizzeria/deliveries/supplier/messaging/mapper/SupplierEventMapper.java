package pizzeria.deliveries.supplier.messaging.mapper;

import org.mapstruct.Mapper;
import pizzeria.deliveries.supplier.dto.request.SupplierRequest;
import pizzeria.deliveries.supplier.messaging.event.SupplierCreatedEvent;

@Mapper(componentModel = "spring")
public interface SupplierEventMapper {
    SupplierRequest toCreatedRequest(SupplierCreatedEvent event);
}
