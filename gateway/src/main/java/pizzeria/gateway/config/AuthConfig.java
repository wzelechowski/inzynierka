package pizzeria.gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Configuration
public class AuthConfig {
    @Bean
    GlobalFilter authFilter() {
        return (exchange, chain) -> exchange.getPrincipal()
                .filter(principal -> principal instanceof JwtAuthenticationToken)
                .cast(JwtAuthenticationToken.class)
                .switchIfEmpty(Mono.empty())
                .flatMap(auth -> {
                    Jwt jwt = auth.getToken();
                    ServerHttpRequest request = exchange.getRequest()
                            .mutate()
                            .headers(headers -> {
                                headers.remove("X-User-Id");
                                headers.remove("X-User-Roles");
                                if (jwt != null) {
                                    headers.add("X-User-Id", jwt.getSubject());
                                    List<String> roles = Optional.ofNullable(jwt.getClaim("realm_access"))
                                                    .filter(Map.class::isInstance)
                                                            .map(Map.class::cast)
                                                                    .map(m -> (List<String>) m.get("roles"))
                                                                            .orElse(List.of());

                                    String rolesHeader = roles.stream()
                                                    .filter(Objects::nonNull)
                                                            .collect(Collectors.joining(","));
                                    headers.add("X-User-Roles", rolesHeader);
                                }
                            })
                            .build();
                    ServerWebExchange newExchange = exchange.mutate()
                            .request(request)
                            .build();

                    return chain.filter(newExchange);
                })
                .switchIfEmpty(chain.filter(exchange));
    }
}
