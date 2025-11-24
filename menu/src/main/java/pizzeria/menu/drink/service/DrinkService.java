package pizzeria.menu.drink.service;

import pizzeria.menu.drink.dto.response.DrinkResponse;
import pizzeria.menu.drink.dto.request.DrinkPatchRequest;
import pizzeria.menu.drink.dto.request.DrinkRequest;

import java.util.List;
import java.util.UUID;

public interface DrinkService {
    List<DrinkResponse> getAllDrinks();

    DrinkResponse getDrinkById(UUID id);

    DrinkResponse save(DrinkRequest request);

    void delete(UUID id);

    DrinkResponse update(UUID id, DrinkRequest request);

    DrinkResponse patch(UUID id, DrinkPatchRequest request);
}
