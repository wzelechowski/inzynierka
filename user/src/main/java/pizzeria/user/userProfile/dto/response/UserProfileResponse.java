package pizzeria.user.userProfile.dto.response;

import pizzeria.user.userProfile.model.Role;

import java.util.List;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        List<Role> roles
) {}
