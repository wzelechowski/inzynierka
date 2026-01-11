package pizzeria.user.userProfile.mapper;

import org.mapstruct.*;
import pizzeria.user.address.mapper.AddressMapper;
import pizzeria.user.userProfile.dto.request.UserProfilePatchRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.UserProfileResponse;
import pizzeria.user.userProfile.model.UserProfile;

@Mapper(componentModel = "spring", uses = AddressMapper.class)
public interface UserProfileMapper {
    UserProfileResponse toResponse(UserProfile userProfile);

    UserProfile toEntity(UserProfileRequest userProfileRequest);

    void updateEntity(@MappingTarget UserProfile userProfile, UserProfileRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget UserProfile userProfile, UserProfilePatchRequest request);

    @AfterMapping
    default void linkAddresses(@MappingTarget UserProfile userProfile) {
        if (userProfile.getAddresses() != null) {
            userProfile.getAddresses().forEach(address -> address.setUser(userProfile));
        }
    }
}
