package pizzeria.user.keycloak;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import pizzeria.user.userProfile.dto.request.AuthRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.AuthResponse;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class KeycloakService {
    private final Keycloak keycloakClient;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.server-url}")
    private String authServerUrl;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    public String createUser(UserProfileRequest request) {
        UserRepresentation user = getUserRepresentation(request);

        UsersResource userResource = keycloakClient.realm(realm).users();

        try (Response response = userResource.create(user)) {
            if (response.getStatus() == HttpStatus.CREATED.value()) {
                String userId = CreatedResponseUtil.getCreatedId(response);
                log.info("User created with id {}", userId);
                try {
                    userResource.get(userId).executeActionsEmail(List.of("VERIFY_EMAIL"));
                    log.info("Wysłano email weryfikacyjny do: {}", request.email());
                } catch (Exception e) {
                    log.error("Nie udało się wysłać maila weryfikacyjnego!", e);
                }

                return userId;
            } else if (response.getStatus() == HttpStatus.CONFLICT.value()) {
                throw new RuntimeException("Użytkownik o takim emailu już istnieje!");
            } else {
                response.bufferEntity();
                String errorBody = response.readEntity(String.class);
                log.error("Error while creating user {}", errorBody);
                throw new RuntimeException("Błąd Keycloak: " + response.getStatus());
            }
        }

    }

    public void deleteUser(String userId) {
        try (Response response = keycloakClient.realm(realm).users().delete(userId)) {
            if (response.getStatus() != HttpStatus.NO_CONTENT.value()) {
                log.error("Cannot delete user from keycloak");
            }
        }
    }

    public AuthResponse login(AuthRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("client_id", clientId);
        map.add("grant_type", "password");
        map.add("username", request.email());
        map.add("password", request.password());
        map.add("client_secret", clientSecret);
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, httpEntity, Map.class);
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            if (body == null) throw new RuntimeException("Empty response from Keycloak");

            return new AuthResponse(
                    (String) body.get("access_token"),
                    (String) body.get("refresh_token"),
                    (String) body.get("token_type"),
                    (Integer) body.get("expires_in")
            );
        } catch (Exception e) {
            log.error("Error while login", e);
            throw new RuntimeException("Nieprawidłowe dane logowania lub błąd serwera");
        }
    }

    private UserRepresentation getUserRepresentation(UserProfileRequest request) {
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.email());
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmailVerified(false);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.password());
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));
        return user;
    }
}
