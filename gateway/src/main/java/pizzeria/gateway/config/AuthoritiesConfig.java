package pizzeria.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;

import java.util.*;
import java.util.stream.Stream;

@Configuration
public class AuthoritiesConfig {

    interface AuthoritiesConverter extends Converter<Map<String, Object>, Collection<GrantedAuthority>> {}

    @Bean
    AuthoritiesConverter realmRolesAuthoritiesConverter() {
        return claims -> {
            var realmAccess = Optional.ofNullable((Map<String, Object>) claims.get("realm_access"));
            var realmRoles = realmAccess.map(map -> (List<String>) map.get("roles"))
                    .orElse(Collections.emptyList());

            List<String> clientRoles = new  ArrayList<>();
            var resourceAccess = Optional.ofNullable((Map<String, Object>) claims.get("resource_access"));

            resourceAccess.ifPresent(stringObjectMap -> stringObjectMap.values().forEach(client -> {
                if (client instanceof Map) {
                    Map<String, Object> map = (Map<String, Object>) client;
                    List<String> roles = (List<String>) map.get("roles");
                    if (roles != null) {
                        clientRoles.addAll(roles);
                    }
                }
            }));

            return Stream.concat(realmRoles.stream(), clientRoles.stream())
                    .distinct()
                    .map(role -> "ROLE_" + role)
                    .map(SimpleGrantedAuthority::new)
                    .map(GrantedAuthority.class::cast)
                    .toList();
        };
    }

    @Bean
    ReactiveJwtAuthenticationConverterAdapter authenticationConverter(AuthoritiesConverter authoritiesConverter) {
        var jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(jwt -> authoritiesConverter.convert(jwt.getClaims()));

        return new ReactiveJwtAuthenticationConverterAdapter(jwtConverter);
    }
}
