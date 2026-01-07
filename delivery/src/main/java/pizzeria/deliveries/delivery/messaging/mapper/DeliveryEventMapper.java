package pizzeria.deliveries.delivery.messaging.mapper;

import org.mapstruct.Mapper;
import pizzeria.deliveries.delivery.dto.request.DeliveryRequest;
import pizzeria.deliveries.delivery.messaging.event.DeliveryRequestedEvent;

@Mapper(componentModel = "spring")
public interface DeliveryEventMapper {
    DeliveryRequest toRequest(DeliveryRequestedEvent event);
}
