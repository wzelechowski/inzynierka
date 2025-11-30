package pizzeria.orders.client.menu;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import pizzeria.orders.client.menu.dto.MenuItemResponse;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MenuItemClient {

    @Value("${menu-service.url}")
    private String menuServiceUrl;
    private final WebClient menuWebClient;

    public MenuItemResponse getMenuItem(UUID itemId) {
        return menuWebClient.get()
                .uri(menuServiceUrl+ "/menuItems/{id}", itemId)
                .retrieve()
                .bodyToMono(MenuItemResponse.class)
                .block();
    }
}
