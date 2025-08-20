package pizzeria.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import pizzeria.user.model.UserProfile;
import pizzeria.user.payloads.request.UserProfileRequest;
import pizzeria.user.payloads.response.UserProfileResponse;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfileResponse toResponse(UserProfile userProfile);

    UserProfile toEntity(UserProfileRequest userProfileRequest);

    void updateEntity(@MappingTarget UserProfile userProfile, UserProfileRequest request);
}
