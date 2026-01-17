package pizzeria.deliveries.supplier.messaging.event;

import java.util.UUID;

public record SupplierCreatedEvent(
        UUID userProfileId,
        String firstName,
        String lastName,
        String phoneNumber
) {
}
