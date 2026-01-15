package pizzeria.user.userProfile.messaging.event;

import java.util.UUID;

public record SupplierCreatedEvent(
        UUID keycloakId,
        String firstName,
        String lastName,
        String phoneNumber
) {
}

