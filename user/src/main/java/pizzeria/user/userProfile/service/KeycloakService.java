package pizzeria.user.userProfile.service;

import pizzeria.user.userProfile.dto.request.AuthRequest;
import pizzeria.user.userProfile.dto.request.RefreshTokenRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.AuthResponse;
import pizzeria.user.userProfile.model.Role;

import java.util.UUID;

public interface KeycloakService {
    UUID createUser(UserProfileRequest request, Role role);
    void deleteUser(UUID keycloakId);
    AuthResponse login(AuthRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(RefreshTokenRequest request);
}
