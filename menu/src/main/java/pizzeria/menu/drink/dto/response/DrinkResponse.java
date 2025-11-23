package pizzeria.menu.drink.dto.response;

public record DrinkResponse(
    Long id,
    String name,
    Double price,
    Double volume
){}
