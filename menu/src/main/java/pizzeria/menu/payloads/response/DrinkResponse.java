package pizzeria.menu.payloads.response;

public record DrinkResponse(
    Long id,
    String name,
    Double price,
    Double volume
){}
