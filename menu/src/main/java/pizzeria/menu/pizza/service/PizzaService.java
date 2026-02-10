package pizzeria.menu.pizza.service;

import pizzeria.menu.pizza.dto.response.PizzaResponse;
import pizzeria.menu.pizza.model.PizzaIngredient;
import pizzeria.menu.pizza.dto.request.PizzaPatchRequest;
import pizzeria.menu.pizza.dto.request.PizzaRequest;

import java.util.List;
import java.util.UUID;

public interface PizzaService {
    List<PizzaResponse> getAllPizzas();

    PizzaResponse getPizzaById(UUID id);

    PizzaResponse save(PizzaRequest request);

    void delete(UUID id);

    PizzaResponse update(UUID id, PizzaRequest request);

    PizzaResponse patch(UUID id, PizzaPatchRequest request);

    List<PizzaIngredient> getAllPizzasIngredients(UUID pizzaId);
}
