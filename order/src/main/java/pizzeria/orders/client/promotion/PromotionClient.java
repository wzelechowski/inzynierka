package pizzeria.orders.client.promotion;

import jakarta.ws.rs.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import pizzeria.orders.client.promotion.dto.PromotionCheckRequest;
import pizzeria.orders.client.promotion.dto.PromotionCheckResponse;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Component
public class PromotionClient {

    private final WebClient promotionWebClient;

    public PromotionClient(WebClient.Builder builder, @Value("${promotion-service.url}") String promotionServiceUrl) {
        this.promotionWebClient = builder.baseUrl(promotionServiceUrl).build();
    }

    public PromotionCheckResponse checkPromotion(List<UUID> productIds) {
        return promotionWebClient.post()
                .uri(UriBuilder ->
                        UriBuilder
                                .path("/api/v1/promotion/check")
                                .build()
                ).bodyValue(new PromotionCheckRequest(productIds))
                .retrieve()
                .onStatus(
                        HttpStatusCode::is4xxClientError,
                        response -> Mono.error(new NotFoundException("Not found"))
                )
                .onStatus(
                        HttpStatusCode::is5xxServerError,
                        response -> Mono.error(new IllegalStateException("Promotion service is unavailable"))
                )
                .bodyToMono(PromotionCheckResponse.class)
                .block();
    }
}
