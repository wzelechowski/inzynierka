package pizzeria.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    @Bean
    SecurityWebFilterChain resourceServerSecurityFilterChain(
            ServerHttpSecurity http,
            Converter<Jwt, Mono<AbstractAuthenticationToken>> authenticationConverter) {
        http.csrf(ServerHttpSecurity.CsrfSpec::disable);
        http.oauth2ResourceServer(resourceServer ->
                resourceServer.jwt(jwtDecoder ->
                        jwtDecoder.jwtAuthenticationConverter(authenticationConverter)));

        http.authorizeExchange(exchanges ->
                exchanges
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        .pathMatchers("/eureka/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/promotion/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/menu/menuItems/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/order/orders/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/order/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/v1/order/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/v1/user/register").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/v1/user/auth/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/v1/delivery/**").hasAnyRole("ADMIN", "SUPPLIER", "manage-account")
                        .pathMatchers(HttpMethod.PUT, "/api/v1/delivery/**").hasAnyRole("ADMIN", "SUPPLIER", "manage-account")
//                        .pathMatchers("/api/v1/**").hasAnyRole("ADMIN", "manage-account")
                        .pathMatchers("/api/v1/menu/**").hasAnyRole("ADMIN", "manage-account")
                        .pathMatchers("/api/v1/order/**").hasAnyRole("ADMIN", "manage-account")
                        .pathMatchers("/api/v1/delivery/**").hasAnyRole("ADMIN", "manage-account")
                        .pathMatchers("/api/v1/user/**").hasAnyRole("ADMIN", "manage-account")
                        .anyExchange()
                        .authenticated()
        ).oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}
