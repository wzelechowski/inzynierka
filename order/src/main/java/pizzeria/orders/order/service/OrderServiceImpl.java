package pizzeria.orders.order.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.orders.client.menu.MenuItemClient;
import pizzeria.orders.client.menu.dto.MenuItemResponse;
import pizzeria.orders.client.promotion.PromotionClient;
import pizzeria.orders.client.promotion.dto.AppliedPromotion;
import pizzeria.orders.client.promotion.dto.PromotionCheckResponse;
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
import pizzeria.orders.orderItem.model.OrderItem;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
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
    private final ApplicationEventPublisher eventPublisher;
    private final PromotionClient promotionClient;

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
    public UUID getOrderUserId(UUID orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(NotFoundException::new);
        return order.getUserId();
    }

    @Override
    @Transactional
    public OrderResponse save(OrderRequest request, UUID userId) {
        Order order = orderMapper.toEntity(request);
        order.setUserId(userId);
        calculateOrderTotalPrice(order);
        orderRepository.save(order);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse save(OrderDeliveryRequest request, UUID userId) {
        Order order = orderMapper.toDeliveryEntity(request);
        order.setUserId(userId);
        calculateOrderTotalPrice(order);
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
    public OrderResponse update(UUID orderId, UUID userId, OrderRequest request) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId).orElseThrow(NotFoundException::new);
        orderMapper.updateEntity(order, request);
        return orderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse patch(UUID orderId, UUID userId, OrderPatchRequest request) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId).orElseThrow(NotFoundException::new);
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

    private BigDecimal applyPromotion(BigDecimal basePrice, AppliedPromotion promotion) {
        BigDecimal result;
        switch (promotion.effectType()) {
            case PERCENT -> {
                BigDecimal multiplier = BigDecimal.ONE.subtract(promotion.discount());
                result = basePrice.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
            }

            case FIXED -> result = basePrice.subtract(promotion.discount());
            case FREE_PRODUCT -> result = BigDecimal.ZERO;
            default -> throw new IllegalArgumentException("Unsupported promotion type: " + promotion.effectType());
        }

        return result.max(BigDecimal.ZERO);
    }

    private void applyDiscount(AppliedPromotion promotion, Order order, OrderItem orderItem, List<OrderItem> discountedItems) {
        BigDecimal finalPrice = applyPromotion(orderItem.getBasePrice(), promotion);
        if (orderItem.getQuantity() > 1) {
            orderItem.setQuantity(orderItem.getQuantity() - 1);
            orderItem.setTotalPrice(orderItem.getFinalPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
            OrderItem discountedOrderItem = modelDiscountedOrderItem(orderItem, finalPrice);
            discountedOrderItem.setOrder(order);
            discountedItems.add(discountedOrderItem);
        } else {
            orderItem.setFinalPrice(finalPrice);
            orderItem.setTotalPrice(finalPrice);
            orderItem.setDiscounted(true);
        }
    }

    private OrderItem modelDiscountedOrderItem(OrderItem orderItem, BigDecimal finalPrice) {
        OrderItem discountedOrderItem = new OrderItem();
        discountedOrderItem.setItemId(orderItem.getItemId());
        discountedOrderItem.setQuantity(1);
        discountedOrderItem.setBasePrice(orderItem.getBasePrice());
        discountedOrderItem.setFinalPrice(finalPrice);
        discountedOrderItem.setTotalPrice(finalPrice);
        discountedOrderItem.setDiscounted(true);
        return discountedOrderItem;
    }

    private List<AppliedPromotion> getOrderPromotions(Order order) {
        List<UUID> orderItemIds = order.getOrderItems()
                .stream()
                .map(OrderItem::getItemId)
                .toList();

        PromotionCheckResponse promotionCheckResponse = promotionClient.checkPromotion(orderItemIds);

        return promotionCheckResponse.appliedPromotions()
                .stream()
                .toList();
    }

    private void calculateOrderTotalPrice(Order order) {
        calculateOrderItemsPrices(order);
        BigDecimal orderTotalPrice = order.getOrderItems()
                .stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalPrice(orderTotalPrice);
    }

    private void calculateOrderItemsPrices(Order order) {
        List<AppliedPromotion> orderPromotions = getOrderPromotions(order);
        List<OrderItem> discountedItems = new ArrayList<>();
        for (OrderItem orderItem : order.getOrderItems()) {
            orderItem.setOrder(order);
            MenuItemResponse menuItem = menuItemClient.getMenuItem(orderItem.getItemId());
            BigDecimal basePrice = menuItem.basePrice();
            orderItem.setBasePrice(menuItem.basePrice());
            orderItem.setFinalPrice(basePrice);
            orderItem.setTotalPrice(basePrice.multiply(BigDecimal.valueOf(orderItem.getQuantity())));
            AppliedPromotion promotion = getBestPromotion(orderPromotions, orderItem);
            if (promotion != null) {
                order.getPromotionIds().add(promotion.promotionId());
                applyDiscount(promotion, order, orderItem, discountedItems);
            }
        }

        if (!discountedItems.isEmpty()) {
            order.getOrderItems().addAll(discountedItems);
        }
    }

    private AppliedPromotion getBestPromotion(List<AppliedPromotion> orderPromotions, OrderItem orderItem) {
        return orderPromotions.stream()
                .filter(p -> p.productId().equals(orderItem.getItemId()))
                .min(Comparator.comparing(
                        p -> applyPromotion(orderItem.getBasePrice(), p)
                ))
                .orElse(null);
    }
}
