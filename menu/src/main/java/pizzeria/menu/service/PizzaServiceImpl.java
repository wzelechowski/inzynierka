package pizzeria.menu.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pizzeria.menu.mapper.PizzaMapper;
import pizzeria.menu.model.Pizza;
import pizzeria.menu.payloads.request.PizzaPatchRequest;
import pizzeria.menu.payloads.request.PizzaRequest;
import pizzeria.menu.repository.PizzaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PizzaServiceImpl implements PizzaService{
    private final PizzaRepository pizzaRepository;
    private final PizzaMapper pizzaMapper;

    public PizzaServiceImpl(PizzaRepository pizzaRepository, PizzaMapper pizzaMapper) {
        this.pizzaRepository = pizzaRepository;
        this.pizzaMapper = pizzaMapper;
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
    public Optional<Pizza> patch(Long id, PizzaPatchRequest request) {
        return pizzaRepository.findById(id)
                .map(pizza -> {
                    if (request.getName() != null) {
                        pizza.setName(request.getName());
                    }
                    if (request.getPrice() != null) {
                        pizza.setPrice(request.getPrice());
                    }
                    if (request.getSize() != null) {
                        pizza.setSize(request.getSize());
                    }
                    return pizzaRepository.save(pizza);
                });
    }
}
