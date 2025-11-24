package pizzeria.menu.drink.dto.response;

import java.util.UUID;

public record DrinkResponse(
    UUID id,
    String name,
    Double volume
){}
