package pizzeria.menu.menuItem.mapper;

import org.mapstruct.*;
import pizzeria.menu.menuItem.dto.request.MenuItemPatchRequest;
import pizzeria.menu.menuItem.dto.request.MenuItemRequest;
import pizzeria.menu.menuItem.dto.response.MenuItemResponse;
import pizzeria.menu.menuItem.model.MenuItem;

@Mapper(componentModel = "spring")
public interface MenuItemMapper {
    MenuItemResponse toResponse(MenuItem menuItem);

    MenuItem toEntity(MenuItemRequest request);

    void updateEntity(@MappingTarget MenuItem menuItem, MenuItemRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget MenuItem menuItem, MenuItemPatchRequest request);
}
