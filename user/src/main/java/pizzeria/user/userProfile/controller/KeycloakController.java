package pizzeria.user.userProfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pizzeria.user.userProfile.dto.request.AuthRequest;
import pizzeria.user.userProfile.dto.request.RefreshTokenRequest;
import pizzeria.user.userProfile.dto.response.AuthResponse;
import pizzeria.user.userProfile.service.KeycloakService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class KeycloakController {

    private final KeycloakService keycloakService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = keycloakService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = keycloakService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        keycloakService.logout(request);
        return ResponseEntity.ok().build();
    }
}
