package pizzeria.menu.ingredient.service;

import pizzeria.menu.ingredient.dto.response.IngredientResponse;
import pizzeria.menu.ingredient.dto.request.IngredientPatchRequest;
import pizzeria.menu.ingredient.dto.request.IngredientRequest;

import java.util.List;
import java.util.UUID;

public interface IngredientService {
    List<IngredientResponse> getAllIngredients();

    IngredientResponse getIngredientById(UUID id);

    IngredientResponse save(IngredientRequest request);

    void delete(UUID id);

    IngredientResponse update(UUID id, IngredientRequest request);

    IngredientResponse patch(UUID id, IngredientPatchRequest request);

}
