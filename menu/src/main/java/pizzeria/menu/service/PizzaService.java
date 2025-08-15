package pizzeria.menu.service;

import pizzeria.menu.model.Pizza;
import pizzeria.menu.model.PizzaIngredient;
import pizzeria.menu.payloads.request.PizzaIngredientRequest;
import pizzeria.menu.payloads.request.PizzaPatchRequest;
import pizzeria.menu.payloads.request.PizzaRequest;

import java.util.List;
import java.util.Optional;

public interface PizzaService {
    List<Pizza> getAllPizzas();

    Optional<Pizza> getPizzaById(Long id);

    Pizza save(PizzaRequest request);

    Optional<Pizza> delete(Long id);

    Optional<Pizza> update(Long id, PizzaRequest request);

    Optional<Pizza> patch(Long id, PizzaPatchRequest request);

    PizzaIngredient addIngredientToPizza(PizzaIngredientRequest request);

    List<PizzaIngredient> getAllPizzasIngredients(Long pizzaId);
}
