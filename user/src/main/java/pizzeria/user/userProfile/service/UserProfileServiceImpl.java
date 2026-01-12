package pizzeria.user.userProfile.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.user.keycloak.KeycloakService;
import pizzeria.user.userProfile.dto.request.UserProfilePatchRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.UserProfileResponse;
import pizzeria.user.userProfile.mapper.UserProfileMapper;
import pizzeria.user.userProfile.model.UserProfile;
import pizzeria.user.userProfile.repository.UserProfileRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;
    private final KeycloakService keycloakService;

    @Override
    public List<UserProfileResponse> getAllUserProfiles() {
        return userProfileRepository.findAll()
                .stream()
                .map(userProfileMapper::toResponse)
                .toList();
    }

    @Override
    public UserProfileResponse getUserProfileById(UUID id) {
        UserProfile userProfile = userProfileRepository.findById(id).orElseThrow(NotFoundException::new);
        return userProfileMapper.toResponse(userProfile);
    }

    @Override
    @Transactional
    public UserProfileResponse save(UserProfileRequest request) {
        String userId = keycloakService.createUser(request);
        try {
            UserProfile userProfile = userProfileMapper.toEntity(request);
            userProfile.setKeycloakId(UUID.fromString(userId));
            userProfileRepository.save(userProfile);
            return userProfileMapper.toResponse(userProfile);
        } catch (Exception e) {
            keycloakService.deleteUser(userId);
            throw e;
        }
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        UserProfile userProfile = userProfileRepository.findById(id).orElseThrow(NotFoundException::new);
        userProfileRepository.delete(userProfile);
    }

    @Override
    @Transactional
    public UserProfileResponse update(UUID id, UserProfileRequest request) {
        UserProfile userProfile = userProfileRepository.findById(id).orElseThrow(NotFoundException::new);
        userProfileMapper.updateEntity(userProfile, request);
        return userProfileMapper.toResponse(userProfile);
    }

    @Override
    @Transactional
    public UserProfileResponse patch(UUID id, UserProfilePatchRequest request) {
        UserProfile userProfile = userProfileRepository.findById(id).orElseThrow(NotFoundException::new);
        userProfileMapper.patchEntity(userProfile, request);
        return userProfileMapper.toResponse(userProfile);
    }
}
