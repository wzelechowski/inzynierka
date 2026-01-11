package pizzeria.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder, RedisRateLimiter rateLimiter, KeyResolver ipKeyResolver) {
        return builder.routes()
                .route("menu-service", r -> r.path("/api/v1/menu/**")
                        .filters(f -> f.requestRateLimiter(rl -> {
                            rl.setRateLimiter(rateLimiter);
                            rl.setKeyResolver(ipKeyResolver);
                        }))
                                .uri("lb://menu-service"))
                .route("order-service", r -> r.path("/api/v1/order/**")
                        .filters(f -> f.requestRateLimiter(rl -> {
                            rl.setRateLimiter(rateLimiter);
                            rl.setKeyResolver(ipKeyResolver);
                        }))
                        .uri("lb://order-service"))
                .route("delivery-service", r -> r.path("/api/v1/delivery/**")
                        .filters(f -> f.requestRateLimiter(rl -> {
                            rl.setRateLimiter(rateLimiter);
                            rl.setKeyResolver(ipKeyResolver);
                        }))
                        .uri("lb://delivery-service"))
                .route("promotion-service", r -> r.path("/api/v1/promotion/**")
                        .filters(f -> f.requestRateLimiter(rl -> {
                            rl.setRateLimiter(rateLimiter);
                            rl.setKeyResolver(ipKeyResolver);
                        }))
                        .uri("lb://promotion-service"))
                .route("user-service", r -> r.path("/api/v1/user/**")
                        .filters(f -> f.requestRateLimiter(rl -> {
                            rl.setRateLimiter(rateLimiter);
                            rl.setKeyResolver(ipKeyResolver);
                        }))
                        .uri("lb://user-service"))
                .build();
    }
}
