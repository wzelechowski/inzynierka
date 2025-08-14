package pizzeria.menu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import pizzeria.menu.model.Pizza;
import pizzeria.menu.payloads.request.PizzaRequest;
import pizzeria.menu.payloads.response.PizzaResponse;

@Mapper(componentModel = "spring")
public interface PizzaMapper {
    PizzaResponse toResponse(Pizza pizza);

    Pizza toEntity(PizzaRequest request);

    void updateEntity(@MappingTarget Pizza pizza, PizzaRequest request);
}
