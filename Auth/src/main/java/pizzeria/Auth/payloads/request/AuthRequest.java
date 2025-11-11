package pizzeria.auth.payloads.request;

public record AuthRequest(
        String username,
        String password
) {}
