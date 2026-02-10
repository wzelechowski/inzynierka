package pizzeria.menu.pizza.mapper;

import org.mapstruct.*;
import pizzeria.menu.pizza.dto.request.PizzaIngredientRequest;
import pizzeria.menu.pizza.dto.request.PizzaPatchRequest;
import pizzeria.menu.pizza.dto.request.PizzaRequest;
import pizzeria.menu.pizza.dto.response.PizzaIngredientResponse;
import pizzeria.menu.pizza.dto.response.PizzaResponse;
import pizzeria.menu.pizza.model.Pizza;
import pizzeria.menu.pizza.model.PizzaIngredient;

@Mapper(componentModel = "spring")
public interface PizzaMapper {
    PizzaResponse toResponse(Pizza pizza);

    @Mapping(target = "pizzaId", source = "id.pizzaId")
    @Mapping(target = "ingredientId", source = "id.ingredientId")
    PizzaIngredientResponse toIngredientResponse(PizzaIngredient pizzaIngredient);

    Pizza toEntity(PizzaRequest request);

    @Mapping(target = "ingredient.id", source = "ingredientId")
    PizzaIngredient toEntityIngredient(PizzaIngredientRequest request);

    void updateEntity(@MappingTarget Pizza pizza, PizzaRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget Pizza pizza, PizzaPatchRequest request);

    @AfterMapping
    default void linkIngredients(@MappingTarget Pizza pizza) {
        if (pizza.getIngredientList() != null) {
            pizza.getIngredientList().forEach(ingredient -> ingredient.setPizza(pizza));
        }
    }
}