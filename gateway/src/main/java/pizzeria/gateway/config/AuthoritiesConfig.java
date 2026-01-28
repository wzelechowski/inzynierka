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

    private final RoleExtractor roleExtractor;

    public AuthoritiesConfig(RoleExtractor roleExtractor) {
        this.roleExtractor = roleExtractor;
    }

    @Bean
    AuthoritiesConverter realmRolesAuthoritiesConverter() {
        return claims -> {
            var realmAccess = Optional.ofNullable((Map<String, Object>) claims.get("realm_access"));
            var realmRoles = realmAccess.map(map -> (List<String>) map.get("roles"))
                    .orElse(Collections.emptyList());

            List<String> clientRoles = new  ArrayList<>();
            var resourceAccess = Optional.ofNullable((Map<String, Object>) claims.get("resource_access"));

            roleExtractor.extractClientRoles(clientRoles, resourceAccess);

            return Stream.concat(realmRoles.stream(), clientRoles.stream())
                    .distinct()
                    .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
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
