package pizzeria.user.payloads.response;

public record UserProfileResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String avatarUrl
) {}
