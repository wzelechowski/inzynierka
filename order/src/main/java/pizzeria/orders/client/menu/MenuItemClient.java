package pizzeria.orders.client.menu;

import jakarta.ws.rs.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import pizzeria.orders.client.menu.dto.MenuItemClientResponse;
import pizzeria.orders.client.menu.dto.MenuItemResponse;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class MenuItemClient {

    private final WebClient menuWebClient;
    private final MenuItemMapper menuItemMapper;

    public MenuItemClient(WebClient.Builder builder, MenuItemMapper menuItemMapper, @Value("${menu-service.url}") String menuServiceUrl) {
        this.menuWebClient = builder.baseUrl(menuServiceUrl).build();
        this.menuItemMapper = menuItemMapper;
    }

    public MenuItemResponse getMenuItem(UUID id) {
        return menuWebClient.get()
                .uri(uriBuilder ->
                                uriBuilder
                                        .path("/api/v1/menu/menuItems/{id}")
                                        .build(id)
                )
                .retrieve()
                .onStatus(
                        HttpStatusCode::is4xxClientError,
                        response -> Mono.error(new NotFoundException("Item not found with id " + id))
                )
                .onStatus(
                        HttpStatusCode::is5xxServerError,
                        response -> Mono.error(new IllegalStateException("Mnu service is unavailable"))
                )
                .bodyToMono(MenuItemClientResponse.class)
                .map(menuItemMapper::toResponse)
                .block();
    }
}
