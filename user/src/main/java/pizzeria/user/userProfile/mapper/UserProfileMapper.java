package pizzeria.user.userProfile.mapper;

import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.*;
import pizzeria.user.userProfile.dto.request.UserProfilePatchRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.UserProfileResponse;
import pizzeria.user.userProfile.model.Role;
import pizzeria.user.userProfile.model.UserProfile;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfileResponse toResponse(UserProfile userProfile);

    @Mapping(target = "phoneNumber", source = "user.attributes", qualifiedByName = "extractPhoneNumber")
    @Mapping(target = "roles", source = "userProfile.roles")
    @Mapping(target = "id", source = "userProfile.id")
    UserProfileResponse toResponse(UserProfile userProfile, UserRepresentation user);

    UserProfile toEntity(UserProfileRequest userProfileRequest);

    void updateEntity(@MappingTarget UserProfile userProfile, UserProfileRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget UserProfile userProfile, UserProfilePatchRequest request);


    @Named("extractPhoneNumber")
    default String extractPhoneNumber(Map<String, List<String>> attributes) {
        if (attributes == null || !attributes.containsKey("phoneNumber")) {
            return null;
        }

        List<String> phones = attributes.get("phoneNumber");
        if (phones == null || phones.isEmpty()) {
            return null;
        }
        return phones.getFirst();
    }

    @Named("extractRoles")
    default List<Role> extractRoles(UserRepresentation user) {
        if (user.getClientRoles().isEmpty()) {
            return Collections.emptyList();
        }

        return user.getClientRoles().values()
                .stream()
                .flatMap(List::stream)
                .map(roleName -> {
                    try {
                        return Role.valueOf(roleName);
                    } catch (IllegalArgumentException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }
}
