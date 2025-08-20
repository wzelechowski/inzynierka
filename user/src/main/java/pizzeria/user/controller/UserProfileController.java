package pizzeria.user.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.user.mapper.UserProfileMapper;
import pizzeria.user.model.UserProfile;
import pizzeria.user.payloads.request.UserProfilePatchRequest;
import pizzeria.user.payloads.request.UserProfileRequest;
import pizzeria.user.payloads.response.UserProfileResponse;
import pizzeria.user.service.UserProfileService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("")
public class UserProfileController {
    private final UserProfileService userProfileService;
    private final UserProfileMapper userProfileMapper;

    public UserProfileController(UserProfileService userProfileService, UserProfileMapper userProfileMapper) {
        this.userProfileService = userProfileService;
        this.userProfileMapper = userProfileMapper;
    }

    @GetMapping("")
    public ResponseEntity<List<UserProfileResponse>> getAllUserProfiles() {
        List<UserProfile> userProfiles = userProfileService.getAllUserProfiles();
        if (userProfiles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<UserProfileResponse> response = userProfiles.stream()
                .map(userProfileMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserProfileById(@PathVariable Long id) {
        Optional<UserProfile> userProfile = userProfileService.getUserProfileById(id);
        if (userProfile.isPresent()) {
            UserProfileResponse response = userProfileMapper.toResponse(userProfile.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("")
    public ResponseEntity<UserProfileResponse> createUserProfile(@Valid @RequestBody UserProfileRequest request) {
        UserProfile userProfile = userProfileService.save(request);
        UserProfileResponse response = userProfileMapper.toResponse(userProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserProfileResponse> deleteUserProfile(@PathVariable Long id) {
        Optional<UserProfile> userProfile = userProfileService.delete(id);
        if (userProfile.isPresent()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateUserProfile(@PathVariable Long id, @Valid @RequestBody UserProfileRequest request) {
        Optional<UserProfile> userProfile= userProfileService.update(id, request);
        if (userProfile.isPresent()) {
            UserProfileResponse response = userProfileMapper.toResponse(userProfile.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PatchMapping("{id}")
    public ResponseEntity<UserProfileResponse> patchUserProfile(@PathVariable Long id, @Valid @RequestBody UserProfilePatchRequest request) {
        Optional<UserProfile> userProfile = userProfileService.patch(id, request);
        if (userProfile.isPresent()) {
            UserProfileResponse response = userProfileMapper.toResponse(userProfile.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }
}
