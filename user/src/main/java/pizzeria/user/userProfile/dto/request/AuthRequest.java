package pizzeria.user.userProfile.dto.request;

public record AuthRequest(
        String email,
        String password,
        String refreshToken
) {
}
