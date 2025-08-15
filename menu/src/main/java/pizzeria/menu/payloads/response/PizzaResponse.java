package pizzeria.menu.payloads.response;

import pizzeria.menu.model.Size;

public record PizzaResponse(
    Long id,
    String name,
    Double price,
    Size size
){}
