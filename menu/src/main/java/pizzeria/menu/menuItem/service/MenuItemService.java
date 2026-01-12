package pizzeria.menu.menuItem.service;

import pizzeria.menu.menuItem.dto.request.MenuItemPatchRequest;
import pizzeria.menu.menuItem.dto.request.MenuItemRequest;
import pizzeria.menu.menuItem.dto.response.MenuItemResponse;

import java.util.List;
import java.util.UUID;

public interface MenuItemService {
    List<MenuItemResponse> getAllMenuItems();

    List<MenuItemResponse> getAvailableMenuItems();

    MenuItemResponse getMenuItemById(UUID id);

    MenuItemResponse save(MenuItemRequest request);

    void delete(UUID id);

    MenuItemResponse update(UUID id, MenuItemRequest request);

    MenuItemResponse patch(UUID id, MenuItemPatchRequest request);
}
