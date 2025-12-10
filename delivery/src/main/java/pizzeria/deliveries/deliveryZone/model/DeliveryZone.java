package pizzeria.deliveries.deliveryZone.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "delivery_zones")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DeliveryZone {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String boundary;

    private BigDecimal baseDeliveryFee;
    private Integer minDeliveryTimeMinutes;
}
