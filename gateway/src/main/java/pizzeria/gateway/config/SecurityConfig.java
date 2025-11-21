package pizzeria.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
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
        http.oauth2ResourceServer(resourceServer ->
                resourceServer.jwt(jwtDecoder ->
                        jwtDecoder.jwtAuthenticationConverter(authenticationConverter)));

        http.authorizeExchange(exchanges ->
                exchanges.pathMatchers("/eureka/**")
                        .permitAll()
                        .anyExchange()
                        .authenticated());

        return http.build();
    }
}
