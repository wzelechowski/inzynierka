package pizzeria.menu.ingredient.mapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pizzeria.menu.ingredient.dto.request.IngredientPatchRequest;
import pizzeria.menu.ingredient.model.Ingredient;
import pizzeria.menu.ingredient.dto.request.IngredientRequest;
import pizzeria.menu.ingredient.dto.response.IngredientResponse;

@Mapper(componentModel = "spring")
public interface IngredientMapper {
    IngredientResponse toResponse(Ingredient ingredient);

    Ingredient toEntity(IngredientRequest request);

    void updateEntity(@MappingTarget Ingredient ingredient, IngredientRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget Ingredient ingredient, IngredientPatchRequest request);
}
