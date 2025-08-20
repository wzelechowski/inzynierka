package pizzeria.user.service;

import pizzeria.user.model.UserProfile;
import pizzeria.user.payloads.request.UserProfilePatchRequest;
import pizzeria.user.payloads.request.UserProfileRequest;

import java.util.List;
import java.util.Optional;

public interface UserProfileService {
    List<UserProfile> getAllUserProfiles();

    Optional<UserProfile> getUserProfileById(Long id);

    UserProfile save(UserProfileRequest request);

    Optional<UserProfile> delete(Long id);

    Optional<UserProfile> update(Long id, UserProfileRequest request);

    Optional<UserProfile> patch(Long id, UserProfilePatchRequest request);
}
