package pizzeria.menu.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pizzeria.menu.mapper.DrinkMapper;
import pizzeria.menu.model.Drink;
import pizzeria.menu.payloads.request.DrinkPatchRequest;
import pizzeria.menu.payloads.request.DrinkRequest;
import pizzeria.menu.repository.DrinkRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DrinkServiceImpl implements DrinkService {
    private final DrinkRepository drinkRepository;
    private final DrinkMapper drinkMapper;

    public DrinkServiceImpl(DrinkRepository drinkRepository, DrinkMapper drinkMapper) {
        this.drinkRepository = drinkRepository;
        this.drinkMapper = drinkMapper;
    }

    @Override
    public List<Drink> getAllDrinks() {
        return drinkRepository.findAll();
    }

    @Override
    public Optional<Drink> getDrinkById(Long id) {
        return drinkRepository.findById(id);
    }

    @Override
    @Transactional
    public Drink save(DrinkRequest request) {
        Drink drink = drinkMapper.toEntity(request);
        return drinkRepository.save(drink);
    }

    @Override
    @Transactional
    public Optional<Drink> delete(Long id) {
        Optional<Drink> drink = drinkRepository.findById(id);
        drink.ifPresent(drinkRepository::delete);
        return drink;
    }

    @Override
    @Transactional
    public Optional<Drink> update(Long id, DrinkRequest request) {
        return drinkRepository.findById(id)
                .map(drink -> {
                    drinkMapper.updateEntity(drink, request);
                    return drinkRepository.save(drink);
                });
    }

    @Override
    @Transactional
    public Optional<Drink> patch(Long id, DrinkPatchRequest request) {
        return drinkRepository.findById(id)
                .map(drink -> {
                    if (request.name() != null) {
                        drink.setName(request.name());
                    }
                    if (request.price() != null) {
                        drink.setPrice(request.price());
                    }
                    if (request.volume() != null) {
                        drink.setVolume(request.volume());
                    }
                    return drinkRepository.save(drink);
                });
    }
}
