package pizzeria.user.userProfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.user.keycloak.KeycloakService;
import pizzeria.user.userProfile.dto.request.AuthRequest;
import pizzeria.user.userProfile.dto.request.UserProfilePatchRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.AuthResponse;
import pizzeria.user.userProfile.dto.response.UserProfileResponse;
import pizzeria.user.userProfile.service.UserProfileService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final KeycloakService keycloakService;

    @GetMapping("")
    public ResponseEntity<List<UserProfileResponse>> getAllUserProfiles() {
        List<UserProfileResponse> response =  userProfileService.getAllUserProfiles();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserProfileById(@PathVariable UUID id) {
        UserProfileResponse response = userProfileService.getUserProfileById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserProfileResponse> createUserProfile(@Valid @RequestBody UserProfileRequest request) {
        UserProfileResponse response = userProfileService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = keycloakService.login(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserProfileResponse> deleteUserProfile(@PathVariable UUID id) {
        userProfileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateUserProfile(@PathVariable UUID id, @Valid @RequestBody UserProfileRequest request) {
        UserProfileResponse response = userProfileService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("{id}")
    public ResponseEntity<UserProfileResponse> patchUserProfile(@PathVariable UUID id, @Valid @RequestBody UserProfilePatchRequest request) {
        UserProfileResponse response = userProfileService.patch(id, request);
        return ResponseEntity.ok(response);
    }
}
