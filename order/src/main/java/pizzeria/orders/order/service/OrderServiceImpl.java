package pizzeria.orders.order.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.orders.client.menu.MenuItemClient;
import pizzeria.orders.client.menu.dto.MenuItemResponse;
import pizzeria.orders.order.dto.request.OrderPatchRequest;
import pizzeria.orders.order.dto.request.OrderRequest;
import pizzeria.orders.order.dto.response.OrderResponse;
import pizzeria.orders.order.mapper.OrderMapper;
import pizzeria.orders.order.model.Order;
import pizzeria.orders.order.model.OrderType;
import pizzeria.orders.order.dto.event.OrderRequestedEvent;
import pizzeria.orders.order.publisher.OrderEventPublisher;
import pizzeria.orders.order.repository.OrderRepository;
import pizzeria.orders.orderItem.model.OrderItem;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final MenuItemClient menuItemClient;
    private final OrderEventPublisher orderEventPublisher;

    @Override
    public List<OrderResponse> getAllUsersOrders(UUID userId) {
        return orderRepository.findAllByUserId(userId)
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
//    @Cacheable(value = "order", key = "#orderId")
    public OrderResponse getOrderById(UUID orderId, UUID userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId).orElseThrow(NotFoundException::new);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse save(OrderRequest request, UUID userId) {
        Order order = orderMapper.toEntity(request);
        order.setUserId(userId);
        order.setTotalPrice(BigDecimal.ZERO);
        for (OrderItem orderItem : order.getOrderItems()) {
            MenuItemResponse menuItem = menuItemClient.getMenuItem(orderItem.getItemId());
            BigDecimal basePrice = menuItem.basePrice();
            orderItem.setBasePrice(basePrice);
            BigDecimal totalPrice = basePrice.multiply(BigDecimal.valueOf(orderItem.getQuantity()));
            orderItem.setTotalPrice(totalPrice);
            orderItem.setOrder(order);
            order.setTotalPrice(order.getTotalPrice().add(orderItem.getTotalPrice()));
        }

        orderRepository.save(order);

        if (order.getType() == OrderType.TAKE_AWAY) {
            var event = new OrderRequestedEvent(order.getId(), userId);
            orderEventPublisher.publishDeliveryRequested(event);
        }

        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public void delete(UUID orderId, UUID userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId).orElseThrow(NotFoundException::new);
        orderRepository.delete(order);
    }

    @Override
    @Transactional
    public OrderResponse update(UUID orderId, UUID userId, OrderRequest request) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId).orElseThrow(NotFoundException::new);
        orderMapper.updateEntity(order, request);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse patch(UUID orderId, UUID userId, OrderPatchRequest request) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId).orElseThrow(NotFoundException::new);
        orderMapper.patchEntity(order, request);
        return orderMapper.toResponse(order);
    }
}
