package pizzeria.menu.pizza.service;

import pizzeria.menu.pizza.dto.response.PizzaResponse;
import pizzeria.menu.pizza.model.PizzaIngredient;
import pizzeria.menu.pizza.dto.request.PizzaIngredientRequest;
import pizzeria.menu.pizza.dto.request.PizzaPatchRequest;
import pizzeria.menu.pizza.dto.request.PizzaRequest;

import java.util.List;

public interface PizzaService {
    List<PizzaResponse> getAllPizzas();

    PizzaResponse getPizzaById(Long id);

    PizzaResponse save(PizzaRequest request);

    void delete(Long id);

    PizzaResponse update(Long id, PizzaRequest request);

    PizzaResponse patch(Long id, PizzaPatchRequest request);

    PizzaIngredient addIngredientToPizza(PizzaIngredientRequest request);

    List<PizzaIngredient> getAllPizzasIngredients(Long pizzaId);
}
