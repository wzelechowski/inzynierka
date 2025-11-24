package pizzeria.menu.pizza.dto.response;

import pizzeria.menu.pizza.model.PizzaSize;

import java.util.UUID;

public record PizzaResponse(
    UUID id,
    String name,
    PizzaSize pizzaSize
) {}
