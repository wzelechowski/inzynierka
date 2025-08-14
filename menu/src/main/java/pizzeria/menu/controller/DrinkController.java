package pizzeria.menu.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.mapper.DrinkMapper;
import pizzeria.menu.model.Drink;
import pizzeria.menu.payloads.request.DrinkPatchRequest;
import pizzeria.menu.payloads.request.DrinkRequest;
import pizzeria.menu.payloads.response.DrinkResponse;
import pizzeria.menu.service.DrinkService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/drinks")
public class DrinkController {
    private final DrinkService drinkService;
    private final DrinkMapper drinkMapper;

    public DrinkController(DrinkService drinkService, DrinkMapper drinkMapper) {
        this.drinkService = drinkService;
        this.drinkMapper = drinkMapper;
    }

    @GetMapping("")
    public ResponseEntity<List<DrinkResponse>> getAllDrinks() {
        List<Drink> drinks = drinkService.getAllDrinks();
        if (drinks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<DrinkResponse> response = drinks.stream()
                .map(drinkMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DrinkResponse> getDrinkById(@PathVariable Long id) {
        Optional<Drink> drink = drinkService.getDrinkById(id);
        if (drink.isPresent()) {
            DrinkResponse response = drinkMapper.toResponse(drink.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("")
    public ResponseEntity<DrinkResponse> createDrink(@Valid @RequestBody DrinkRequest request) {
        Drink drink = drinkService.save(request);
        DrinkResponse response = drinkMapper.toResponse(drink);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DrinkResponse> deleteDrink(@PathVariable Long id) {
        Optional<Drink> drink = drinkService.delete(id);
        if (drink.isPresent()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DrinkResponse> updateDrink(@PathVariable Long id, @Valid @RequestBody DrinkRequest request) {
        Optional<Drink> drink = drinkService.update(id, request);
        if (drink.isPresent()) {
            DrinkResponse response = drinkMapper.toResponse(drink.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DrinkResponse> patchDrink(@PathVariable Long id, @Valid @RequestBody DrinkPatchRequest request) {
        Optional<Drink> drink = drinkService.patch(id, request);
        if (drink.isPresent()) {
            DrinkResponse response = drinkMapper.toResponse(drink.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }
}
