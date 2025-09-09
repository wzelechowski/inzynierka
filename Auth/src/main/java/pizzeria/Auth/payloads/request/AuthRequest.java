package pizzeria.auth.payloads.request;

public record AuthRequest(
        String email,
        String password,
        String name
){}
