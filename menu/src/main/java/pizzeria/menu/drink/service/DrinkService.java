package pizzeria.menu.drink.service;

import pizzeria.menu.drink.dto.response.DrinkResponse;
import pizzeria.menu.drink.dto.request.DrinkPatchRequest;
import pizzeria.menu.drink.dto.request.DrinkRequest;

import java.util.List;

public interface DrinkService {
    List<DrinkResponse> getAllDrinks();

    DrinkResponse getDrinkById(Long id);

    DrinkResponse save(DrinkRequest request);

    void delete(Long id);

    DrinkResponse update(Long id, DrinkRequest request);

    DrinkResponse patch(Long id, DrinkPatchRequest request);
}
