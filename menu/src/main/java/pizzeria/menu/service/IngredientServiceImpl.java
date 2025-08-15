package pizzeria.menu.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pizzeria.menu.mapper.IngredientMapper;
import pizzeria.menu.model.Ingredient;
import pizzeria.menu.payloads.request.IngredientPatchRequest;
import pizzeria.menu.payloads.request.IngredientRequest;
import pizzeria.menu.repository.IngredientRepository;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientServiceImpl implements IngredientService {
    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    public IngredientServiceImpl(IngredientRepository ingredientRepository, IngredientMapper ingredientMapper) {
        this.ingredientRepository = ingredientRepository;
        this.ingredientMapper = ingredientMapper;
    }

    @Override
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    @Override
    public Optional<Ingredient> getIngredientById(Long id) {
        return ingredientRepository.findById(id);
    }

    @Override
    @Transactional
    public Ingredient save(IngredientRequest request) {
        Ingredient ingredient = ingredientMapper.toEntity(request);
        return ingredientRepository.save(ingredient);
    }

    @Override
    @Transactional
    public Optional<Ingredient> delete(Long id) {
        Optional<Ingredient> ingredient = ingredientRepository.findById(id);
        ingredient.ifPresent(ingredientRepository::delete);
        return ingredient;
    }

    @Override
    @Transactional
    public Optional<Ingredient> update(Long id, IngredientRequest request) {
        return ingredientRepository.findById(id)
                .map(ing -> {
                    ingredientMapper.updateEntity(ing, request);
                    return ingredientRepository.save(ing);
                });
    }

    @Override
    @Transactional
    public Optional<Ingredient> patch(Long id, IngredientPatchRequest request) {
        return ingredientRepository.findById(id)
                .map(ing -> {
                    if (request.name() != null) {
                        ing.setName(request.name());
                    }
                    if (request.price() != null) {
                        ing.setPrice(request.price());
                    }
                    return ingredientRepository.save(ing);
                });
    }
}
