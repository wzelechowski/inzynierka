package pizzeria.deliveries.supplier.messaging.event;

import java.util.UUID;

public record SupplierDeletedEvent(
        UUID userProfileId
) {
}
