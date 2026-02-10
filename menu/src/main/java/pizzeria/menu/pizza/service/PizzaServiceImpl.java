package pizzeria.menu.pizza.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pizzeria.menu.ingredient.model.Ingredient;
import pizzeria.menu.ingredient.repository.IngredientRepository;
import pizzeria.menu.pizza.dto.request.PizzaPatchRequest;
import pizzeria.menu.pizza.dto.request.PizzaRequest;
import pizzeria.menu.pizza.dto.response.PizzaResponse;
import pizzeria.menu.pizza.mapper.PizzaMapper;
import pizzeria.menu.pizza.model.Pizza;
import pizzeria.menu.pizza.model.PizzaIngredient;
import pizzeria.menu.pizza.repository.PizzaRepository;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PizzaServiceImpl implements PizzaService {
    private final PizzaRepository pizzaRepository;
    private final PizzaMapper pizzaMapper;
    private final IngredientRepository ingredientRepository;

    @Override
    @Cacheable(value = "pizzas")
    public List<PizzaResponse> getAllPizzas() {
        return pizzaRepository.findAll()
                .stream()
                .map(pizzaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "pizza", key = "#id")
    public PizzaResponse getPizzaById(UUID id) {
        Pizza pizza = pizzaRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        return pizzaMapper.toResponse(pizza);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "pizza", key = "#result.id"),
            evict = @CacheEvict(value = "pizzas", allEntries = true)
    )
    public PizzaResponse save(PizzaRequest request) {
        Pizza pizza = pizzaMapper.toEntity(request);
        if (pizza.getIngredientList() != null) {
            pizza.getIngredientList().forEach(pizzaIngredient -> {
                pizzaIngredient.setPizza(pizza);
                UUID ingredientId = pizzaIngredient.getIngredient().getId();
                Ingredient realIngredient = ingredientRepository.findById(ingredientId).orElseThrow(RuntimeException::new);
                pizzaIngredient.setIngredient(realIngredient);
            });
        }

        pizzaRepository.save(pizza);
        return pizzaMapper.toResponse(pizza);
    }

    @Override
    @Transactional
    @Caching(
            evict = {
                    @CacheEvict(value = "pizza", key = "#id"),
                    @CacheEvict(value = "pizzas", allEntries = true)
            }
    )
    public void delete(UUID id) {
        Pizza pizza = pizzaRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        pizzaRepository.delete(pizza);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "pizza", key = "#result.id"),
            evict = @CacheEvict(value = "pizzas", allEntries = true)
    )
    public PizzaResponse update(UUID id, PizzaRequest request) {
        Pizza pizza = pizzaRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        pizzaMapper.updateEntity(pizza, request);
        pizzaRepository.save(pizza);
        return pizzaMapper.toResponse(pizza);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "pizza", key = "#result.id"),
            evict = @CacheEvict(value = "pizzas", allEntries = true)
    )
    public PizzaResponse patch(UUID id, PizzaPatchRequest request) {
        Pizza pizza = pizzaRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        pizzaMapper.patchEntity(pizza, request);
        pizzaRepository.save(pizza);
        return pizzaMapper.toResponse(pizza);
    }

    @Override
    public List<PizzaIngredient> getAllPizzasIngredients(UUID pizzaId) {
        return pizzaRepository.findById(pizzaId)
                .map(Pizza::getIngredientList).orElse(Collections.emptyList());
    }
}
