package pizzeria.orders.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pizzeria.orders.order.dto.request.CartCalculateRequest;
import pizzeria.orders.order.dto.response.CartCalculateResponse;
import pizzeria.orders.order.mapper.OrderMapper;
import pizzeria.orders.order.model.Order;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final OrderMapper orderMapper;
    private final PricingService pricingService;

    @Override
    public CartCalculateResponse calculateCart(CartCalculateRequest request) {
        Order dummyOrder = orderMapper.toCartEntity(request);
        pricingService.processOrderPricing(dummyOrder);
        return orderMapper.toCartResponse(dummyOrder);
    }
}
