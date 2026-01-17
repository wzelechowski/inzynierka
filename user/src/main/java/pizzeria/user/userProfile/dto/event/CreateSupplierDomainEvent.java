package pizzeria.user.userProfile.dto.event;

import java.util.UUID;

public record CreateSupplierDomainEvent(
        UUID userProfileId,
        String firstName,
        String lastName,
        String phoneNumber
) {
}

