package pizzeria.gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
public class AuthConfig {

    private final RoleExtractor roleExtractor;

    public AuthConfig(RoleExtractor roleExtractor) {
        this.roleExtractor = roleExtractor;
    }

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
                                    List<String> realmRoles = Optional.ofNullable(jwt.getClaim("realm_access"))
                                                    .filter(Map.class::isInstance)
                                                            .map(Map.class::cast)
                                                                    .map(m -> (List<String>) m.get("roles"))
                                                                            .orElse(List.of());

                                    List<String> clientRoles = new ArrayList<>();
                                    var resourceAccess = Optional.ofNullable((Map<String, Object>) jwt.getClaim("resource_access"));
                                    roleExtractor.extractClientRoles(clientRoles, resourceAccess);

                                    String rolesHeader = Stream.concat(realmRoles.stream(), clientRoles.stream())
                                        .distinct()
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
