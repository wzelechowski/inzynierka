package pizzeria.menu.menuItem.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.menuItem.dto.request.MenuItemPatchRequest;
import pizzeria.menu.menuItem.dto.request.MenuItemRequest;
import pizzeria.menu.menuItem.dto.response.MenuItemResponse;
import pizzeria.menu.menuItem.service.MenuItemService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/menuItems")
public class MenuItemController {
    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping("")
    public ResponseEntity<List<MenuItemResponse>> getAllMenuItems() {
        List<MenuItemResponse> response = menuItemService.getAllMenuItems();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/available")
    public ResponseEntity<List<MenuItemResponse>> getAvailableMenuItems() {
        List<MenuItemResponse> response = menuItemService.getAvailableMenuItems();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemResponse> getMenuItem(@PathVariable UUID id) {
        MenuItemResponse response = menuItemService.getMenuItemById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<MenuItemResponse> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse response = menuItemService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MenuItemResponse> deleteMenuItem(@PathVariable UUID id) {
        menuItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItemResponse> updateMenuItem(@PathVariable UUID id, @Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse response = menuItemService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MenuItemResponse> patchMenuItem(@PathVariable UUID id, @Valid @RequestBody MenuItemPatchRequest request) {
        MenuItemResponse response = menuItemService.patch(id, request);
        return ResponseEntity.ok(response);
    }
}
