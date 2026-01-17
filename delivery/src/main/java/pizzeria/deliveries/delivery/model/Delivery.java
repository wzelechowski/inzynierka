package pizzeria.deliveries.delivery.model;

import jakarta.persistence.*;
import lombok.*;
import pizzeria.deliveries.supplier.model.Supplier;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "deliveries")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DeliveryStatus status = DeliveryStatus.PENDING;

    private String deliveryAddress;
    private String deliveryCity;
    private String postalCode;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    public void assignSupplier(Supplier supplier) {
        this.supplier = supplier;
        this.status = DeliveryStatus.ASSIGNED;
        this.assignedAt = LocalDateTime.now();
    }

    public void changeStatus(DeliveryStatus newStatus) {
        if (newStatus == null) {
            return;
        }

        if (newStatus != DeliveryStatus.CANCELLED) {
            if (this.supplier == null) {
                throw new IllegalArgumentException("Cannot change delivery status without supplier");
            }
        }

       if(!this.status.canTransitionTo(newStatus)) {
           throw new IllegalArgumentException("Cannot change delivery status");
       }

        this.status = newStatus;
        setTimestamps(newStatus);
    }

    private void setTimestamps(DeliveryStatus status) {
        switch (status) {
            case PENDING -> {
                this.assignedAt = null;
                this.setSupplier(null);
            }
            case PICKED_UP -> this.pickedUpAt = LocalDateTime.now();
            case DELIVERED -> this.deliveredAt = LocalDateTime.now();
        }
    }
}
