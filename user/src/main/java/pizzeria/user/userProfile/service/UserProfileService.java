package pizzeria.user.userProfile.service;

import pizzeria.user.userProfile.dto.request.UserProfilePatchRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.UserProfileResponse;

import java.util.List;
import java.util.UUID;

public interface UserProfileService {
    List<UserProfileResponse> getAllUserProfiles();

    UserProfileResponse getUserProfileById(UUID id);

    UserProfileResponse save(UserProfileRequest request);

    void delete(UUID id);

    UserProfileResponse update(UUID id, UserProfileRequest request);

    UserProfileResponse patch(UUID id, UserProfilePatchRequest request);
}
