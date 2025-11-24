package pizzeria.menu.ingredient.service;

import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pizzeria.menu.ingredient.dto.response.IngredientResponse;
import pizzeria.menu.ingredient.mapper.IngredientMapper;
import pizzeria.menu.ingredient.model.Ingredient;
import pizzeria.menu.ingredient.dto.request.IngredientPatchRequest;
import pizzeria.menu.ingredient.dto.request.IngredientRequest;
import pizzeria.menu.ingredient.repository.IngredientRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class IngredientServiceImpl implements IngredientService {
    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    public IngredientServiceImpl(IngredientRepository ingredientRepository, IngredientMapper ingredientMapper) {
        this.ingredientRepository = ingredientRepository;
        this.ingredientMapper = ingredientMapper;
    }

    @Override
    @Cacheable(value = "ingredients")
    public List<IngredientResponse> getAllIngredients() {
        return ingredientRepository.findAll()
                .stream()
                .map(ingredientMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "ingredient", key = "#id")
    public IngredientResponse getIngredientById(UUID id) {
        Ingredient ingredient = ingredientRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        return ingredientMapper.toResponse(ingredient);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "ingredient", key = "#result.id"),
            evict = @CacheEvict(value = "ingredients", allEntries = true)
    )
    public IngredientResponse save(IngredientRequest request) {
        Ingredient ingredient = ingredientMapper.toEntity(request);
        ingredientRepository.save(ingredient);
        return ingredientMapper.toResponse(ingredient);
    }

    @Override
    @Transactional
    @Caching(
            evict = {
                    @CacheEvict(value = "ingredient", key = "#id"),
                    @CacheEvict(value = "ingredients", allEntries = true)
            }
    )
    public void delete(UUID id) {
        Ingredient ingredient = ingredientRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        ingredientRepository.delete(ingredient);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "ingredient", key = "#result.id"),
            evict = @CacheEvict(value = "ingredients", allEntries = true)
    )
    public IngredientResponse update(UUID id, IngredientRequest request) {
        Ingredient ingredient = ingredientRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        ingredientMapper.updateEntity(ingredient, request);
        ingredientRepository.save(ingredient);
        return ingredientMapper.toResponse(ingredient);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "ingredient", key = "#result.id"),
            evict = @CacheEvict(value = "ingredients", allEntries = true)
    )
    public IngredientResponse patch(UUID id, IngredientPatchRequest request) {
        Ingredient ingredient = ingredientRepository.findById(id).orElseThrow(() -> new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        ingredientMapper.patchEntity(ingredient, request);
        ingredientRepository.save(ingredient);
        return ingredientMapper.toResponse(ingredient);
    }
}
