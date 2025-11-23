package pizzeria.menu.pizza.service;

import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pizzeria.menu.ingredient.model.Ingredient;
import pizzeria.menu.pizza.dto.response.PizzaResponse;
import pizzeria.menu.pizza.model.PizzaIngredient;
import pizzeria.menu.pizza.dto.request.PizzaIngredientRequest;
import pizzeria.menu.pizza.dto.request.PizzaPatchRequest;
import pizzeria.menu.pizza.dto.request.PizzaRequest;
import pizzeria.menu.pizza.mapper.PizzaMapper;
import pizzeria.menu.pizza.model.Pizza;
import pizzeria.menu.pizza.repository.PizzaRepository;
import pizzeria.menu.ingredient.repository.IngredientRepository;
import pizzeria.menu.pizza.repository.PizzaIngredientRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PizzaServiceImpl implements PizzaService {
    private final PizzaRepository pizzaRepository;
    private final PizzaMapper pizzaMapper;
    private final PizzaIngredientRepository pizzaIngredientRepository;
    private final IngredientRepository ingredientRepository;

    public PizzaServiceImpl(PizzaRepository pizzaRepository, PizzaMapper pizzaMapper, PizzaIngredientRepository pizzaIngredientRepository, IngredientRepository ingredientRepository) {
        this.pizzaRepository = pizzaRepository;
        this.pizzaMapper = pizzaMapper;
        this.pizzaIngredientRepository = pizzaIngredientRepository;
        this.ingredientRepository = ingredientRepository;
    }

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
    public PizzaResponse getPizzaById(Long id) {
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
    public void delete(Long id) {
        Pizza pizza = pizzaRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        pizzaRepository.delete(pizza);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "pizza", key = "#result.id"),
            evict = @CacheEvict(value = "pizzas", allEntries = true)
    )
    public PizzaResponse update(Long id, PizzaRequest request) {
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
    public PizzaResponse patch(Long id, PizzaPatchRequest request) {
        Pizza pizza = pizzaRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        if (request.name() != null) {
            pizza.setName(request.name());
        }
        if (request.price() != null) {
            pizza.setPrice(request.price());
        }
        if (request.size() != null) {
            pizza.setSize(request.size());
        }

        pizzaRepository.save(pizza);
        return pizzaMapper.toResponse(pizza);
    }

    @Override
    @Transactional
    public PizzaIngredient addIngredientToPizza(PizzaIngredientRequest request) {
        Optional<Pizza> pizza = pizzaRepository.findById(request.pizzaId());
        Optional<Ingredient> ingredient = ingredientRepository.findById(request.ingredientId());
        PizzaIngredient pizzaIngredient = new PizzaIngredient();
        pizza.ifPresent(pizzaIngredient::setPizza);
        ingredient.ifPresent(pizzaIngredient::setIngredient);
        pizzaIngredient.setQuantity(request.quantity());
        return pizzaIngredientRepository.save(pizzaIngredient);
    }

    @Override
    public List<PizzaIngredient> getAllPizzasIngredients(Long pizzaId) {
        return pizzaRepository.findById(pizzaId)
                .map(Pizza::getIngredientList).orElse(Collections.emptyList());
    }
}
