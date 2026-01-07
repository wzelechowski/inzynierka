package pizzeria.orders.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.Length;
import pizzeria.orders.order.model.OrderType;
import pizzeria.orders.orderItem.dto.request.OrderItemRequest;

import java.util.List;

public record OrderDeliveryRequest(
        @NotNull
        OrderType type,

        @NotEmpty
        List<OrderItemRequest> orderItems,

        @NotBlank
        @Length(min=2, max=255)
        String deliveryAddress,

        @NotBlank
        @Length(min=2, max=255)
        String deliveryCity,

        @NotBlank
        @Pattern(regexp = "\\d{2}-\\d{3}")
        String postalCode
) {
}
