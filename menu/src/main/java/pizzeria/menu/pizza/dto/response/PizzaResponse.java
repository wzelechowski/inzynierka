package pizzeria.menu.pizza.dto.response;

import pizzeria.menu.common.model.enums.Size;

public record PizzaResponse(
    Long id,
    String name,
    Double price,
    Size size
) {}
