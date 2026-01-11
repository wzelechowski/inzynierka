package pizzeria.user.userProfile.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        UUID keycloakId,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        LocalDateTime createdAt
) {}
