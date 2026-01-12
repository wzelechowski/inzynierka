package pizzeria.menu.drink.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.drink.dto.request.DrinkPatchRequest;
import pizzeria.menu.drink.dto.request.DrinkRequest;
import pizzeria.menu.drink.dto.response.DrinkResponse;
import pizzeria.menu.drink.service.DrinkService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/drinks")
public class DrinkController {
    private final DrinkService drinkService;

    public DrinkController(DrinkService drinkService) {
        this.drinkService = drinkService;
    }

    @GetMapping("")
    public ResponseEntity<List<DrinkResponse>> getAllDrinks() {
        List<DrinkResponse> response = drinkService.getAllDrinks();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DrinkResponse> getDrinkById(@PathVariable UUID id) {
        DrinkResponse response = drinkService.getDrinkById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<DrinkResponse> createDrink(@Valid @RequestBody DrinkRequest request) {
        DrinkResponse response = drinkService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DrinkResponse> deleteDrink(@PathVariable UUID id) {
        drinkService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DrinkResponse> updateDrink(@PathVariable UUID id, @Valid @RequestBody DrinkRequest request) {
        DrinkResponse response = drinkService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DrinkResponse> patchDrink(@PathVariable UUID id, @Valid @RequestBody DrinkPatchRequest request) {
        DrinkResponse response = drinkService.patch(id, request);
        return ResponseEntity.ok(response);
    }
}
