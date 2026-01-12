package pizzeria.orders.order.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pizzeria.orders.order.dto.request.CartCalculateRequest;
import pizzeria.orders.order.dto.response.CartCalculateResponse;
import pizzeria.orders.order.service.CartService;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/calculate")
    public ResponseEntity<CartCalculateResponse> calculateCart(@Valid @RequestBody CartCalculateRequest request) {
        CartCalculateResponse response = cartService.calculateCart(request);
        return ResponseEntity.ok(response);
    }
}
