package pizzeria.menu.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import pizzeria.menu.model.Ingredient;
import pizzeria.menu.payloads.request.IngredientRequest;
import pizzeria.menu.payloads.response.IngredientResponse;

@Mapper(componentModel = "spring")
public interface IngredientMapper {
    IngredientResponse toResponse(Ingredient ingredient);

    Ingredient toEntity(IngredientRequest request);

    void updateEntity(@MappingTarget Ingredient ingredient, IngredientRequest request);
}
