package pizzeria.orders.client.menu;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import pizzeria.orders.client.menu.dto.MenuItemClientResponse;
import pizzeria.orders.client.menu.dto.MenuItemResponse;

@Mapper(componentModel = "spring")
public interface MenuItemMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "basePrice", source = "basePrice")
    MenuItemResponse toResponse(MenuItemClientResponse response);
}
