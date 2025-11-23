package pizzeria.menu.ingredient.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import pizzeria.menu.ingredient.model.Ingredient;
import pizzeria.menu.ingredient.dto.request.IngredientRequest;
import pizzeria.menu.ingredient.dto.response.IngredientResponse;

@Mapper(componentModel = "spring")
public interface IngredientMapper {
    IngredientResponse toResponse(Ingredient ingredient);

    Ingredient toEntity(IngredientRequest request);

    void updateEntity(@MappingTarget Ingredient ingredient, IngredientRequest request);
}
