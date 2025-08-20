package pizzeria.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pizzeria.user.mapper.UserProfileMapper;
import pizzeria.user.model.UserProfile;
import pizzeria.user.payloads.request.UserProfilePatchRequest;
import pizzeria.user.payloads.request.UserProfileRequest;
import pizzeria.user.repository.UserProfileRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileServiceImpl implements UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserProfileMapper userProfileMapper;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository, UserProfileMapper userProfileMapper) {
        this.userProfileRepository = userProfileRepository;
        this.userProfileMapper = userProfileMapper;
    }

    @Override
    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }

    @Override
    public Optional<UserProfile> getUserProfileById(Long id) {
        return userProfileRepository.findById(id);
    }

    @Override
    @Transactional
    public UserProfile save(UserProfileRequest request) {
        UserProfile userProfile = userProfileMapper.toEntity(request);
        return userProfileRepository.save(userProfile);
    }

    @Override
    @Transactional
    public Optional<UserProfile> delete(Long id) {
        Optional<UserProfile> userProfile = userProfileRepository.findById(id);
        userProfile.ifPresent(userProfileRepository::delete);
        return userProfile;
    }

    @Override
    @Transactional
    public Optional<UserProfile> update(Long id, UserProfileRequest request) {
        return userProfileRepository.findById(id)
                .map(up -> {
                    userProfileMapper.updateEntity(up, request);
                    return userProfileRepository.save(up);
                });
    }

    @Override
    @Transactional
    public Optional<UserProfile> patch(Long id, UserProfilePatchRequest request) {
        return userProfileRepository.findById(id)
                .map(up -> {
                    if (request.firstName() != null) {
                        up.setFirstName(request.firstName());
                    }
                    if (request.lastName() != null) {
                        up.setLastName(request.lastName());
                    }
                    if (request.email() != null) {
                        up.setEmail(request.email());
                    }
                    if (request.phoneNumber() != null) {
                        up.setPhoneNumber(request.phoneNumber());
                    }
                    if (request.avatarUrl() != null) {
                        up.setAvatarUrl(request.avatarUrl());
                    }
                    return userProfileRepository.save(up);
                });
    }
}
