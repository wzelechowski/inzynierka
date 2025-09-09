package pizzeria.auth.payloads.response;

public record AuthResponse(
        String accessToken,
        String refreshToken
){}
