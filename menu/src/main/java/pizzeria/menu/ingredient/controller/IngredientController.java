package pizzeria.menu.ingredient.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.ingredient.dto.request.IngredientPatchRequest;
import pizzeria.menu.ingredient.dto.request.IngredientRequest;
import pizzeria.menu.ingredient.dto.response.IngredientResponse;
import pizzeria.menu.ingredient.service.IngredientService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("")
    public ResponseEntity<List<IngredientResponse>> getAllIngredients() {
        List<IngredientResponse> response = ingredientService.getAllIngredients();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredientResponse> getIngredientById(@PathVariable UUID id) {
        IngredientResponse response = ingredientService.getIngredientById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<IngredientResponse> createIngredient(@Valid @RequestBody IngredientRequest request) {
        IngredientResponse response = ingredientService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<IngredientResponse> deleteIngredient(@PathVariable UUID id) {
        ingredientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredientResponse> updateIngredient(@PathVariable UUID id, @Valid @RequestBody IngredientRequest request) {
        IngredientResponse response = ingredientService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<IngredientResponse> patchIngredient(@PathVariable UUID id, @Valid @RequestBody IngredientPatchRequest request) {
        IngredientResponse response = ingredientService.patch(id, request);
        return ResponseEntity.ok(response);
    }
}
