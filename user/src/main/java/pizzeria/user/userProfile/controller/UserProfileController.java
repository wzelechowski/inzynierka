package pizzeria.user.userProfile.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.user.userProfile.dto.request.UserProfilePatchRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.UserProfileResponse;
import pizzeria.user.userProfile.service.UserProfileService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

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

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyUserProfile(@RequestHeader("X-User-Id") UUID userId) {
        UserProfileResponse response = userProfileService.getUserProfileByKeycloakId(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserProfileResponse> createUserProfile(@Valid @RequestBody UserProfileRequest request) {
        UserProfileResponse response = userProfileService.registerClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/supplier")
    public ResponseEntity<UserProfileResponse> createSupplier(@Valid @RequestBody UserProfileRequest request) {
        UserProfileResponse response = userProfileService.registerSupplier(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable UUID id) {
        userProfileService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/supplier")
    public ResponseEntity<Void> deleteSupplier(@PathVariable UUID id) {
        userProfileService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateUserProfile(@PathVariable UUID id, @Valid @RequestBody UserProfileRequest request) {
        UserProfileResponse response = userProfileService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserProfileResponse> patchUserProfile(@PathVariable UUID id, @Valid @RequestBody UserProfilePatchRequest request) {
        UserProfileResponse response = userProfileService.patch(id, request);
        return ResponseEntity.ok(response);
    }
}
