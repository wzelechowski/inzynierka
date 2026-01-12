package pizzeria.orders.orderItem.model;

import jakarta.persistence.*;
import lombok.*;
import pizzeria.orders.order.model.Order;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID itemId;
    private Integer quantity;
    private BigDecimal basePrice;
    private BigDecimal finalPrice;
    private BigDecimal totalPrice;

    @Builder.Default
    private Boolean discounted = false;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @PrePersist
    @PreUpdate
    public void calculateTotalPrice() {
        if (finalPrice != null && quantity != null) {
            this.totalPrice = finalPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
