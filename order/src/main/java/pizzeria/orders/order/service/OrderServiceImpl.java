package pizzeria.orders.order.service;

import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.orders.order.dto.event.OrderCompletedDomainEvent;
import pizzeria.orders.order.dto.request.OrderDeliveryRequest;
import pizzeria.orders.order.dto.request.OrderPatchRequest;
import pizzeria.orders.order.dto.request.OrderRequest;
import pizzeria.orders.order.dto.response.OrderResponse;
import pizzeria.orders.order.mapper.OrderMapper;
import pizzeria.orders.order.messaging.event.OrderRequestedEvent;
import pizzeria.orders.order.messaging.publisher.OrderEventPublisher;
import pizzeria.orders.order.model.Order;
import pizzeria.orders.order.model.OrderStatus;
import pizzeria.orders.order.repository.OrderRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderEventPublisher orderEventPublisher;
    private final ApplicationEventPublisher eventPublisher;
    private final PricingService pricingService;

    @Override
    public List<OrderResponse> getAllOrders(UUID userId, String roles) {
        List<String> userRoles = Arrays.asList(roles.split(","));
        boolean isStaff = userRoles.contains("ROLE_ADMIN");
        if (isStaff) {
            return orderRepository.findAll()
                    .stream()
                    .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                    .map(orderMapper::toResponse)
                    .collect(Collectors.toList());
        }

        return orderRepository.findAllByUserId(userId)
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
//    @Cacheable(value = "order", key = "#orderId")
    public OrderResponse getOrderById(UUID orderId, UUID userId, String roles) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        List<String> userRoles = Arrays.asList(roles.split(","));
        boolean isOwner = order.getUserId().equals(userId);
        boolean isStaff = userRoles.contains("ROLE_ADMIN") || userRoles.contains("ROLE_SUPPLIER");

        if (!isOwner && !isStaff) {
            throw new ForbiddenException("Not authorized to order");
        }

        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse save(OrderRequest request, UUID userId) {
        Order order = orderMapper.toEntity(request);
        order.setUserId(userId);
        pricingService.processOrderPricing(order);
        orderRepository.save(order);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse save(OrderDeliveryRequest request, UUID userId) {
        Order order = orderMapper.toDeliveryEntity(request);
        order.setUserId(userId);
        pricingService.processOrderPricing(order);
        orderRepository.save(order);
        var event = new OrderRequestedEvent(order.getId(), request.deliveryAddress(), request.deliveryCity(), request.postalCode());
        orderEventPublisher.publishDeliveryRequested(event);
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
    public OrderResponse update(UUID orderId, OrderRequest request) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        orderMapper.updateEntity(order, request);
        pricingService.processOrderPricing(order);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse patch(UUID orderId, OrderPatchRequest request) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        OrderStatus previousStatus = order.getStatus();
        if (previousStatus != OrderStatus.COMPLETED && request.status() == OrderStatus.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
            eventPublisher.publishEvent(
                    new OrderCompletedDomainEvent(order)
            );
        }

        orderMapper.patchEntity(order, request);
        return orderMapper.toResponse(order);
    }
}
