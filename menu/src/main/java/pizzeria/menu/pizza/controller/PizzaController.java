package pizzeria.menu.pizza.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.pizza.model.PizzaIngredient;
import pizzeria.menu.pizza.dto.request.PizzaIngredientRequest;
import pizzeria.menu.pizza.dto.response.PizzaIngredientResponse;
import pizzeria.menu.pizza.dto.request.PizzaPatchRequest;
import pizzeria.menu.pizza.dto.request.PizzaRequest;
import pizzeria.menu.pizza.dto.response.PizzaResponse;
import pizzeria.menu.pizza.service.PizzaService;

import java.util.*;

@RestController
@RequestMapping("/pizzas")
public class PizzaController {
    private final PizzaService pizzaService;

    public PizzaController(PizzaService pizzaService) {
        this.pizzaService = pizzaService;
    }

    @GetMapping("")
    public ResponseEntity<List<PizzaResponse>> getAllPizzas() {
        List<PizzaResponse> response = pizzaService.getAllPizzas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PizzaResponse> getPizzaById(@PathVariable UUID id) {
        PizzaResponse pizza = pizzaService.getPizzaById(id);
        return ResponseEntity.ok(pizza);
    }

    @PostMapping("")
    public ResponseEntity<PizzaResponse> createPizza(@Valid @RequestBody PizzaRequest request) {
        PizzaResponse response = pizzaService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PizzaResponse> updatePizza(@PathVariable UUID id, @Valid @RequestBody PizzaRequest request) {
        PizzaResponse response = pizzaService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PizzaResponse> deletePizza(@PathVariable UUID id) {
        pizzaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PizzaResponse> patchPizza(@PathVariable UUID id, @Valid @RequestBody PizzaPatchRequest request) {
        PizzaResponse response = pizzaService.patch(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pizzaIngredients/{pizzaId}")
    public ResponseEntity<List<PizzaIngredientResponse>> getPizzaIngredientById(@PathVariable UUID pizzaId) {
        List<PizzaIngredient> pizzaIngredients = pizzaService.getAllPizzasIngredients(pizzaId);
        if (pizzaIngredients.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<PizzaIngredientResponse> responses = pizzaIngredients.stream()
                .map(ing -> new PizzaIngredientResponse(
                        ing.getPizza().getId(),
                        ing.getIngredient().getId(),
                        ing.getQuantity()
                )).toList();
        return ResponseEntity.ok(responses);
    }
}
