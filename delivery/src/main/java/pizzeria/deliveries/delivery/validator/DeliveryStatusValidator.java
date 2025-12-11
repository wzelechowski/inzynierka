package pizzeria.deliveries.delivery.validator;

import jakarta.ws.rs.BadRequestException;
import org.springframework.stereotype.Component;
import pizzeria.deliveries.delivery.model.DeliveryStatus;

@Component
public class DeliveryStatusValidator {

    public void validate(DeliveryStatus current, DeliveryStatus requested) {
        if (requested.ordinal() < current.ordinal()) {
            throw new BadRequestException("Invalid delivery status");
        }

        if (requested == DeliveryStatus.CANCELLED) {
            if (current != DeliveryStatus.ASSIGNED) {
                throw new BadRequestException("Invalid delivery status");
            }
            return;
        }

        if (requested.ordinal() - current.ordinal() < 1) {
            throw new BadRequestException("Invalid delivery status");
        }
    }
}
