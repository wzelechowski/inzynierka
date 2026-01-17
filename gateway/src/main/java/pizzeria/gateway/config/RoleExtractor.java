package pizzeria.gateway.config;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class RoleExtractor {

    void extractClientRoles(List<String> clientRoles, Optional<Map<String, Object>> resourceAccess) {
        resourceAccess.ifPresent(resourceAccessMap -> resourceAccessMap.values().forEach(client -> {
            if (client instanceof Map) {
                Map<String, Object> map = (Map<String, Object>) client;
                List<String> roles = (List<String>) map.get("roles");
                if (roles != null && !roles.isEmpty()) {
                    clientRoles.addAll(roles);
                }
            }
        }));
    }
}
