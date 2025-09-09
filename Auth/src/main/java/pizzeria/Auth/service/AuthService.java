package pizzeria.auth.service;

import pizzeria.auth.payloads.request.AuthRequest;
import pizzeria.auth.payloads.response.AuthResponse;

public interface AuthService {
    AuthResponse register(AuthRequest authRequest);
}
