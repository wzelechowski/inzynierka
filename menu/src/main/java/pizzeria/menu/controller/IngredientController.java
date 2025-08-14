package pizzeria.menu.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.mapper.IngredientMapper;
import pizzeria.menu.model.Ingredient;
import pizzeria.menu.payloads.request.IngredientPatchRequest;
import pizzeria.menu.payloads.request.IngredientRequest;
import pizzeria.menu.payloads.response.IngredientResponse;
import pizzeria.menu.service.IngredientService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/ingredients")
public class IngredientController {
    private final IngredientService ingredientService;
    private final IngredientMapper ingredientMapper;

    public IngredientController(IngredientService ingredientService, IngredientMapper ingredientMapper) {
        this.ingredientService = ingredientService;
        this.ingredientMapper = ingredientMapper;
    }

    @GetMapping("")
    public ResponseEntity<List<IngredientResponse>> getAllIngredients() {
        List<Ingredient> ingredients = ingredientService.getAllIngredients();
        if (ingredients.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<IngredientResponse> response = ingredients.stream()
                .map(ingredientMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredientResponse> getIngredientById(@PathVariable Long id) {
        Optional<Ingredient> ingredient = ingredientService.getIngredientById(id);
        if (ingredient.isPresent()) {
            IngredientResponse response = ingredientMapper.toResponse(ingredient.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("")
    public ResponseEntity<IngredientResponse> createIngredient(@Valid @RequestBody IngredientRequest request) {
        Ingredient ingredient = ingredientService.save(request);
        IngredientResponse response = ingredientMapper.toResponse(ingredient);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<IngredientResponse> deleteIngredient(@PathVariable Long id) {
        Optional<Ingredient> ingredient = ingredientService.delete(id);
        if (ingredient.isPresent()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredientResponse> updateIngredient(@PathVariable Long id, @Valid @RequestBody IngredientRequest request) {
        Optional<Ingredient> ingredient = ingredientService.update(id, request);
        if (ingredient.isPresent()) {
            IngredientResponse response = ingredientMapper.toResponse(ingredient.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<IngredientResponse> patchIngredient(@PathVariable Long id, @Valid @RequestBody IngredientPatchRequest request) {
        Optional<Ingredient> ingredient = ingredientService.patch(id, request);
        if (ingredient.isPresent()) {
            IngredientResponse response = ingredientMapper.toResponse(ingredient.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }
}
