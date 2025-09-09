package pizzeria.auth.service;

import org.springframework.stereotype.Service;
import pizzeria.auth.payloads.request.AuthRequest;
import pizzeria.auth.payloads.response.AuthResponse;

@Service
public class AuthServiceImpl implements AuthService {
    private final JwtService jwtService;

    public AuthServiceImpl(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(AuthRequest authRequest) {
        String accessToken = jwtService.generate(authRequest.email(), "ACCESS");
        String refreshToken = jwtService.generate(authRequest.email(), "REFRESH");

        return new AuthResponse(accessToken, refreshToken);
    }
}
