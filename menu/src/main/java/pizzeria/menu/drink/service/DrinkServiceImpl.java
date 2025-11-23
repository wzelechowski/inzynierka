package pizzeria.menu.drink.service;

import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pizzeria.menu.drink.dto.response.DrinkResponse;
import pizzeria.menu.drink.mapper.DrinkMapper;
import pizzeria.menu.drink.model.Drink;
import pizzeria.menu.drink.dto.request.DrinkPatchRequest;
import pizzeria.menu.drink.dto.request.DrinkRequest;
import pizzeria.menu.drink.repository.DrinkRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DrinkServiceImpl implements DrinkService {
    private final DrinkRepository drinkRepository;
    private final DrinkMapper drinkMapper;

    public DrinkServiceImpl(DrinkRepository drinkRepository, DrinkMapper drinkMapper) {
        this.drinkRepository = drinkRepository;
        this.drinkMapper = drinkMapper;
    }

    @Override
    @Cacheable(value = "drinks")
    public List<DrinkResponse> getAllDrinks() {
        return drinkRepository.findAll()
                .stream()
                .map(drinkMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "drink", key = "#id")
    public DrinkResponse getDrinkById(Long id) {
        Drink drink = drinkRepository.findById(id).orElseThrow(() ->  new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        return drinkMapper.toResponse(drink);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "drink", key = "#result.id"),
            evict = @CacheEvict(value = "drinks", allEntries = true)
    )
    public DrinkResponse save(DrinkRequest request) {
        Drink drink = drinkMapper.toEntity(request);
        drinkRepository.save(drink);
        return drinkMapper.toResponse(drink);
    }

    @Override
    @Transactional
    @Caching(
            evict = {
                    @CacheEvict(value = "drink", key = "#id"),
                    @CacheEvict(value = "drinks", allEntries = true)
            }
    )
    public void delete(Long id) {
        Drink drink = drinkRepository.findById(id).orElseThrow(() ->  new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        drinkRepository.delete(drink);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "drink", key = "#result.id"),
            evict = @CacheEvict(value = "drinks", allEntries = true)
    )
    public DrinkResponse update(Long id, DrinkRequest request) {
        Drink drink =  drinkRepository.findById(id).orElseThrow(() ->  new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        drinkMapper.updateEntity(drink, request);
        drinkRepository.save(drink);
        return drinkMapper.toResponse(drink);
    }

    @Override
    @Transactional
    @Caching(
            put = @CachePut(value = "drink", key = "#result.id"),
            evict = @CacheEvict(value = "drinks", allEntries = true)
    )
    public DrinkResponse patch(Long id, DrinkPatchRequest request) {
        Drink drink = drinkRepository.findById(id).orElseThrow(() ->  new RuntimeException(String.valueOf(HttpStatus.NOT_FOUND)));
        if (request.name() != null) {
            drink.setName(request.name());
        }
        if (request.price() != null) {
            drink.setPrice(request.price());
        }
        if (request.volume() != null) {
            drink.setVolume(request.volume());
        }
        drinkRepository.save(drink);
        return drinkMapper.toResponse(drink);
    }
}
