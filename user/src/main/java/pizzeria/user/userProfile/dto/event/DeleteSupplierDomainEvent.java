package pizzeria.user.userProfile.dto.event;

import java.util.UUID;

public record DeleteSupplierDomainEvent(
        UUID userProfileId
) {
}
