package pizzeria.user.userProfile.service;

import pizzeria.user.userProfile.dto.request.UserProfilePatchRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.UserProfileResponse;
import pizzeria.user.userProfile.model.Role;

import java.util.List;
import java.util.UUID;

public interface UserProfileService {
    List<UserProfileResponse> getAllUserProfiles();

    UserProfileResponse getUserProfileById(UUID id);

    UserProfileResponse getUserProfileByKeycloakId(UUID id);

    UserProfileResponse save(UserProfileRequest request, Role role);

    void delete(UUID id, Role role);

    UserProfileResponse update(UUID id, UserProfileRequest request);

    UserProfileResponse patch(UUID id, UserProfilePatchRequest request);
}
