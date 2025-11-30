package pizzeria.orders.client.menu;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import pizzeria.orders.client.menu.dto.MenuItemClientResponse;
import pizzeria.orders.client.menu.dto.MenuItemResponse;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MenuItemClient {

    private final WebClient menuWebClient;
    private final MenuItemMapper menuItemMapper;

    public MenuItemResponse getMenuItem(UUID id) {
        MenuItemClientResponse response = menuWebClient.get()
                .uri(uriBuilder ->
                                uriBuilder
                                        .path("/api/v1/menu/menuItems/{id}")
                                        .build(id)
                )
                .retrieve()
                .bodyToMono(MenuItemClientResponse.class)
                .block();

        return menuItemMapper.toResponse(response);
    }
}
