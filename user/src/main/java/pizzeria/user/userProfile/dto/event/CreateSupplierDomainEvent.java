package pizzeria.user.userProfile.dto.event;

import java.util.UUID;

public record CreateSupplierDomainEvent(
        UUID keycloakId,
        String firstName,
        String lastName,
        String phoneNumber
) {
}

