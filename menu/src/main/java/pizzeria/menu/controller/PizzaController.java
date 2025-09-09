package pizzeria.menu.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.mapper.PizzaMapper;
import pizzeria.menu.model.Pizza;
import pizzeria.menu.model.PizzaIngredient;
import pizzeria.menu.payloads.request.PizzaIngredientRequest;
import pizzeria.menu.payloads.request.PizzaPatchRequest;
import pizzeria.menu.payloads.request.PizzaRequest;
import pizzeria.menu.payloads.response.PizzaIngredientResponse;
import pizzeria.menu.payloads.response.PizzaResponse;
import pizzeria.menu.service.PizzaService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/pizzas")
public class PizzaController {
    private final PizzaService pizzaService;
    private final PizzaMapper pizzaMapper;

    public PizzaController(PizzaService pizzaService, PizzaMapper pizzaMapper) {
        this.pizzaService = pizzaService;
        this.pizzaMapper = pizzaMapper;
    }

    @GetMapping("")
    public ResponseEntity<List<PizzaResponse>> getAllPizzas() {
        List<Pizza> pizzas = pizzaService.getAllPizzas();
        if (pizzas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<PizzaResponse> response = pizzas.stream()
                .map(pizzaMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PizzaResponse> getPizzaById(@PathVariable Long id) {
        Optional<Pizza> pizza = pizzaService.getPizzaById(id);
        if (pizza.isPresent()) {
            PizzaResponse response = pizzaMapper.toResponse(pizza.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("")
    public ResponseEntity<PizzaResponse> createPizza(@Valid @RequestBody PizzaRequest request) {
        Pizza pizza = pizzaService.save(request);
        PizzaResponse response = pizzaMapper.toResponse(pizza);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PizzaResponse> deletePizza(@PathVariable Long id) {
        Optional<Pizza> pizza = pizzaService.delete(id);
        if (pizza.isPresent()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PizzaResponse> updatePizza(@PathVariable Long id, @Valid @RequestBody PizzaRequest request) {
        Optional<Pizza> pizza = pizzaService.update(id, request);
        if (pizza.isPresent()) {
            PizzaResponse response = pizzaMapper.toResponse(pizza.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PizzaResponse> patchPizza(@PathVariable Long id, @Valid @RequestBody PizzaPatchRequest request) {
        Optional<Pizza> pizza = pizzaService.patch(id, request);
        if (pizza.isPresent()) {
            PizzaResponse response = pizzaMapper.toResponse(pizza.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/pizzaIngredients")
    public ResponseEntity<PizzaIngredientResponse> addIngredientToPizza(@Valid @RequestBody PizzaIngredientRequest request) {
        PizzaIngredient pizzaIngredient = pizzaService.addIngredientToPizza(request);
        PizzaIngredientResponse response = new PizzaIngredientResponse(pizzaIngredient.getPizza().getId(),  pizzaIngredient.getIngredient().getId(), pizzaIngredient.getQuantity());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pizzaIngredients/{pizzaId}")
    public ResponseEntity<List<PizzaIngredientResponse>> getPizzaIngredientById(@PathVariable Long pizzaId) {
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
