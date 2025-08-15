package pizzeria.menu.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pizzeria.menu.mapper.PizzaMapper;
import pizzeria.menu.model.Ingredient;
import pizzeria.menu.model.Pizza;
import pizzeria.menu.model.PizzaIngredient;
import pizzeria.menu.payloads.request.PizzaIngredientRequest;
import pizzeria.menu.payloads.request.PizzaPatchRequest;
import pizzeria.menu.payloads.request.PizzaRequest;
import pizzeria.menu.repository.IngredientRepository;
import pizzeria.menu.repository.PizzaIngredientRepository;
import pizzeria.menu.repository.PizzaRepository;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PizzaServiceImpl implements PizzaService{
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
    public List<Pizza> getAllPizzas() {
        return pizzaRepository.findAll();
    }

    @Override
    public Optional<Pizza> getPizzaById(Long id) {
        return pizzaRepository.findById(id);
    }

    @Override
    @Transactional
    public Pizza save(PizzaRequest request) {
        Pizza pizza = pizzaMapper.toEntity(request);
        return pizzaRepository.save(pizza);
    }

    @Override
    @Transactional
    public Optional<Pizza> delete(Long id) {
        Optional<Pizza> pizza = pizzaRepository.findById(id);
        pizza.ifPresent(pizzaRepository::delete);
        return pizza;
    }

    @Override
    @Transactional
    public Optional<Pizza> update(Long id, PizzaRequest request) {
        return pizzaRepository.findById(id)
                .map(pizza -> {
                    pizzaMapper.updateEntity(pizza, request);
                    return pizzaRepository.save(pizza);
                });
    }

    @Override
    @Transactional
    public Optional<Pizza> patch(Long id, PizzaPatchRequest request) {
        return pizzaRepository.findById(id)
                .map(pizza -> {
                    if (request.name() != null) {
                        pizza.setName(request.name());
                    }
                    if (request.price() != null) {
                        pizza.setPrice(request.price());
                    }
                    if (request.size() != null) {
                        pizza.setSize(request.size());
                    }
                    return pizzaRepository.save(pizza);
                });
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
