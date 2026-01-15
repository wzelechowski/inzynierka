package pizzeria.deliveries.supplier.messaging.mapper;

import org.mapstruct.Mapper;
import pizzeria.deliveries.supplier.dto.request.SupplierRequest;
import pizzeria.deliveries.supplier.messaging.event.SupplierCreatedEvent;
import pizzeria.deliveries.supplier.messaging.event.SupplierDeletedEvent;

@Mapper(componentModel = "spring")
public interface SupplierEventMapper {
    SupplierRequest toCreatedRequest(SupplierCreatedEvent event);

    SupplierRequest toDeletedRequest(SupplierDeletedEvent event);
}
