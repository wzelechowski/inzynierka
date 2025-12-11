package pizzeria.orders.order.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pizzeria.orders.config.RabbitConfig;
import pizzeria.orders.order.dto.event.OrderStatusEvent;
import pizzeria.orders.order.model.DeliveryStatus;
import pizzeria.orders.order.model.Order;
import pizzeria.orders.order.model.OrderStatus;
import pizzeria.orders.order.model.OrderType;
import pizzeria.orders.order.repository.OrderRepository;

@Service
@RequiredArgsConstructor
public class OrderEventListener {

    private final OrderRepository orderRepository;

    @RabbitListener(queues = RabbitConfig.ORDER_QUEUE)
    public void order(OrderStatusEvent event) {
        Order order = orderRepository.findById(event.orderId()).orElseThrow(() -> new RuntimeException("Order not found"));
        DeliveryStatus status = DeliveryStatus.valueOf(event.status().toUpperCase());
        if (order.getType() == OrderType.TAKE_AWAY) {
            if (status == DeliveryStatus.PICKED_UP) {
                order.setStatus(OrderStatus.DELIVERY);
            }

            if (status ==  DeliveryStatus.CANCELLED) {
                order.setStatus(OrderStatus.CANCELLED);
            }

            if (status ==  DeliveryStatus.DELIVERED) {
                order.setStatus(OrderStatus.COMPLETED);
            }
        }

        orderRepository.save(order);
    }
}
