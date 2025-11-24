package pizzeria.menu.pizza.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pizzeria.menu.pizza.dto.request.PizzaPatchRequest;
import pizzeria.menu.pizza.dto.request.PizzaRequest;
import pizzeria.menu.pizza.dto.response.PizzaResponse;
import pizzeria.menu.pizza.model.Pizza;

@Mapper(componentModel = "spring")
public interface PizzaMapper {
    PizzaResponse toResponse(Pizza pizza);

    Pizza toEntity(PizzaRequest request);

    void updateEntity(@MappingTarget Pizza pizza, PizzaRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget Pizza pizza, PizzaPatchRequest request);
}
