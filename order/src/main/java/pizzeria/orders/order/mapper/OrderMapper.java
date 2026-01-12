package pizzeria.orders.order.mapper;

import org.mapstruct.*;
import pizzeria.orders.order.dto.request.CartCalculateRequest;
import pizzeria.orders.order.dto.request.OrderDeliveryRequest;
import pizzeria.orders.order.dto.request.OrderPatchRequest;
import pizzeria.orders.order.dto.request.OrderRequest;
import pizzeria.orders.order.dto.response.CartCalculateResponse;
import pizzeria.orders.order.dto.response.OrderResponse;
import pizzeria.orders.order.model.Order;
import pizzeria.orders.orderItem.mapper.OrderItemMapper;

@Mapper(componentModel = "spring", uses = OrderItemMapper.class)
public interface OrderMapper {
    OrderResponse toResponse(Order order);

    Order toEntity(OrderRequest request);

    Order toDeliveryEntity(OrderDeliveryRequest request);

    Order toCartEntity(CartCalculateRequest request);

    CartCalculateResponse toCartResponse(Order order);

    void updateEntity(@MappingTarget Order order, OrderRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget Order order, OrderPatchRequest request);

    @AfterMapping
    default void linkItems(@MappingTarget Order order) {
        if (order.getOrderItems() != null) {
            order.getOrderItems().forEach(orderItem -> orderItem.setOrder(order));
        }
    }
}
