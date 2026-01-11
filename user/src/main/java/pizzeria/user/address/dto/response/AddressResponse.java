package pizzeria.user.address.dto.response;

import java.util.UUID;

public record AddressResponse(
        UUID userId,
        String street,
        String buildingNumber,
        String flatNumber,
        String city,
        String postalCode
) {
}
