package pizzeria.menu.ingredient.service;

import pizzeria.menu.ingredient.dto.response.IngredientResponse;
import pizzeria.menu.ingredient.dto.request.IngredientPatchRequest;
import pizzeria.menu.ingredient.dto.request.IngredientRequest;

import java.util.List;

public interface IngredientService {
    List<IngredientResponse> getAllIngredients();

    IngredientResponse getIngredientById(Long id);

    IngredientResponse save(IngredientRequest request);

    void delete(Long id);

    IngredientResponse update(Long id, IngredientRequest request);

    IngredientResponse patch(Long id, IngredientPatchRequest request);

}
