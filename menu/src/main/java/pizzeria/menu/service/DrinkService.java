package pizzeria.menu.service;

import pizzeria.menu.model.Drink;
import pizzeria.menu.payloads.request.DrinkPatchRequest;
import pizzeria.menu.payloads.request.DrinkRequest;

import java.util.List;
import java.util.Optional;

public interface DrinkService {
    List<Drink> getAllDrinks();

    Optional<Drink> getDrinkById(Long id);

    Drink save(DrinkRequest request);

    Optional<Drink> delete(Long id);

    Optional<Drink> update(Long id, DrinkRequest request);

    Optional<Drink> patch(Long id, DrinkPatchRequest request);
}
