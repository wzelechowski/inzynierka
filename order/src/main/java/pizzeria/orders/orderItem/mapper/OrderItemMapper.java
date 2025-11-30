package pizzeria.orders.orderItem.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import pizzeria.orders.orderItem.dto.request.OrderItemRequest;
import pizzeria.orders.orderItem.dto.response.OrderItemResponse;
import pizzeria.orders.orderItem.model.OrderItem;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    @Mapping(target = "orderId", source = "order.id")
    OrderItemResponse toResponse(OrderItem orderItem);

    OrderItem toEntity(OrderItemRequest request);
}
