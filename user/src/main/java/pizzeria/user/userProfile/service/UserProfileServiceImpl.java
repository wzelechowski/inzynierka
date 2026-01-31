package pizzeria.user.userProfile.service;

import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.user.userProfile.dto.event.CreateSupplierDomainEvent;
import pizzeria.user.userProfile.dto.event.DeleteSupplierDomainEvent;
import pizzeria.user.userProfile.dto.request.UserProfilePatchRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.UserProfileResponse;
import pizzeria.user.userProfile.mapper.UserProfileMapper;
import pizzeria.user.userProfile.model.Role;
import pizzeria.user.userProfile.model.UserProfile;
import pizzeria.user.userProfile.repository.UserProfileRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;
    private final KeycloakServiceImpl keycloakService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public List<UserProfileResponse> getAllUserProfiles() {
        return userProfileRepository.findAll()
                .stream()
                .map(u -> {
                    UserRepresentation ur = keycloakService.getUser(u.getKeycloakId());
                    return userProfileMapper.toResponse(u, ur);
                })
                .toList();
    }

    @Override
    public UserProfileResponse getUserProfileById(UUID id) {
        UserProfile userProfile = userProfileRepository.findById(id).orElseThrow(NotFoundException::new);
        UserRepresentation userRepresentation = keycloakService.getUser(userProfile.getKeycloakId());
        return userProfileMapper.toResponse(userProfile, userRepresentation);
    }

    @Override
    public UserProfileResponse getUserProfileByKeycloakId(UUID id) {
        UserProfile userProfile = userProfileRepository.findByKeycloakId(id).orElseThrow(NotFoundException::new);
        UserRepresentation userRepresentation = keycloakService.getUser(id);
        return userProfileMapper.toResponse(userProfile, userRepresentation);
    }

    @Override
    @Transactional
    public UserProfileResponse registerClient(UserProfileRequest request) {
        Role role = Role.ROLE_CLIENT;
        UUID keycloakId = keycloakService.createUser(request, role);
        try {
            UserProfile userProfile = userProfileMapper.toEntity(request);
            userProfile.setKeycloakId(keycloakId);
            userProfile.getRoles().add(role);
            userProfileRepository.save(userProfile);
            return userProfileMapper.toResponse(userProfile);
        } catch (Exception e) {
            keycloakService.deleteUser(keycloakId);
            throw e;
        }
    }

    @Override
    @Transactional
    public UserProfileResponse registerSupplier(UserProfileRequest request) {
        Role role = Role.ROLE_SUPPLIER;
        UUID keycloakId = keycloakService.createUser(request, role);
        try {
            UserProfile userProfile = userProfileMapper.toEntity(request);
            userProfile.setKeycloakId(keycloakId);
            userProfile.getRoles().add(role);
            userProfileRepository.save(userProfile);
            eventPublisher.publishEvent(
                    new CreateSupplierDomainEvent(
                            userProfile.getId(),
                            request.firstName(),
                            request.lastName(),
                            request.phoneNumber()
                    )
            );
            return userProfileMapper.toResponse(userProfile);
        } catch (Exception e) {
            keycloakService.deleteUser(keycloakId);
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteClient(UUID id) {
        UserProfile userProfile = userProfileRepository.findById(id).orElseThrow(NotFoundException::new);
        keycloakService.deleteUser(userProfile.getKeycloakId());
        userProfileRepository.delete(userProfile);
    }

    @Override
    @Transactional
    public void deleteSupplier(UUID id) {
        UserProfile userProfile = userProfileRepository.findById(id).orElseThrow(NotFoundException::new);
        keycloakService.deleteUser(userProfile.getKeycloakId());
        eventPublisher.publishEvent(new DeleteSupplierDomainEvent(userProfile.getId()));
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
