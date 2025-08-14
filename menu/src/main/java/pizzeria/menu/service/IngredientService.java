package pizzeria.menu.service;

import pizzeria.menu.model.Ingredient;
import pizzeria.menu.payloads.request.IngredientPatchRequest;
import pizzeria.menu.payloads.request.IngredientRequest;

import java.util.List;
import java.util.Optional;

public interface IngredientService {
    List<Ingredient> getAllIngredients();

    Optional<Ingredient> getIngredientById(Long id);

    Ingredient save(IngredientRequest request);

    Optional<Ingredient> delete(Long id);

    Optional<Ingredient> update(Long id, IngredientRequest request);

    Optional<Ingredient> patch(Long id, IngredientPatchRequest request);

}
