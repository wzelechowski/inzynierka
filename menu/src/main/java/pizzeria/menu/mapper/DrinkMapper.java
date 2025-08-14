package pizzeria.menu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import pizzeria.menu.model.Drink;
import pizzeria.menu.payloads.request.DrinkRequest;
import pizzeria.menu.payloads.response.DrinkResponse;

@Mapper(componentModel = "spring")
public interface DrinkMapper {
    DrinkResponse toResponse(Drink drink);

    Drink toEntity(DrinkRequest request);

    void updateEntity(@MappingTarget Drink drink, DrinkRequest request);
}
