package pizzeria.user.userProfile.messaging.event;

import java.util.UUID;

public record SupplierDeletedEvent(
        UUID userProfileId
) {
}
