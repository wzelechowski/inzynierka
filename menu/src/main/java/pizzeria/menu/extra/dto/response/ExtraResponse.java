package pizzeria.menu.extra.dto.response;

import java.util.UUID;

public record ExtraResponse(
    UUID id,
    String name,
    Double weight
){}
