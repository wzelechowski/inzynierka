package pizzeria.deliveries.delivery.validator;

import org.springframework.stereotype.Component;
import pizzeria.deliveries.delivery.model.Delivery;
import pizzeria.deliveries.delivery.model.DeliveryStatus;

@Component
public class DeliverySupplierAssignValidator {

    public void validate(Delivery delivery) {
        if (delivery.getSupplier() != null) {
            throw new IllegalStateException("Supplier already assigned");
        }

        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new IllegalStateException("Supplier can be assigned only when delivery is PENDING");
        }
    }
}
