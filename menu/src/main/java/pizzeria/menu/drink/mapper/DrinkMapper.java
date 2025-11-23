package pizzeria.menu.drink.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import pizzeria.menu.drink.model.Drink;
import pizzeria.menu.drink.dto.request.DrinkRequest;
import pizzeria.menu.drink.dto.response.DrinkResponse;

@Mapper(componentModel = "spring")
public interface DrinkMapper {
    DrinkResponse toResponse(Drink drink);

    Drink toEntity(DrinkRequest request);

    void updateEntity(@MappingTarget Drink drink, DrinkRequest request);
}
