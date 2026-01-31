package pizzeria.orders.order.messaging.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pizzeria.orders.config.RabbitConfig;
import pizzeria.orders.order.messaging.event.OrderStatusEvent;
import pizzeria.orders.order.dto.request.OrderPatchRequest;
import pizzeria.orders.order.messaging.mapper.OrderEventMapper;
import pizzeria.orders.order.service.OrderService;

@Service
@RequiredArgsConstructor
public class OrderEventListener {

    private final OrderService orderService;
    private final OrderEventMapper orderEventMapper;

    @RabbitListener(queues = RabbitConfig.ORDER_QUEUE)
    public void orderStatusChanged(OrderStatusEvent event) {
        OrderPatchRequest request = orderEventMapper.toPatchRequest(event);
        orderService.patch(event.orderId(), request);
    }
}
