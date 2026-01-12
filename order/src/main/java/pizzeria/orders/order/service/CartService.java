package pizzeria.orders.order.service;

import pizzeria.orders.order.dto.request.CartCalculateRequest;
import pizzeria.orders.order.dto.response.CartCalculateResponse;

public interface CartService {
    CartCalculateResponse calculateCart(CartCalculateRequest request);
}
