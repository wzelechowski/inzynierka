package pizzeria.user.address.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import pizzeria.user.address.dto.request.AddressRequest;
import pizzeria.user.address.dto.response.AddressResponse;
import pizzeria.user.address.model.Address;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(target = "userId", source = "user.id")
    AddressResponse toResponse(Address address);

    Address toEntity(AddressRequest request);
}
