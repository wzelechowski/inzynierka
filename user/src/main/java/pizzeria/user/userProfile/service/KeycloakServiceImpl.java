package pizzeria.user.userProfile.service;

import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import pizzeria.user.userProfile.dto.request.AuthRequest;
import pizzeria.user.userProfile.dto.request.RefreshTokenRequest;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;
import pizzeria.user.userProfile.dto.response.AuthResponse;
import pizzeria.user.userProfile.model.Role;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class KeycloakServiceImpl implements KeycloakService {

    private final Keycloak keycloakClient;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.server-url}")
    private String authServerUrl;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    @Override
    public UserRepresentation getUser(UUID keycloakId) {
        return keycloakClient.realm(realm)
                .users()
                .get(keycloakId.toString())
                .toRepresentation();
    }

    @Override
    public UUID createUser(UserProfileRequest request, Role role) {
        UserRepresentation user = getUserRepresentation(request, role);
        UsersResource userResource = keycloakClient.realm(realm).users();

        try (Response response = userResource.create(user)) {
            if (response.getStatus() == HttpStatus.CREATED.value()) {
                String userId = CreatedResponseUtil.getCreatedId(response);
                log.info("User created with id {}", userId);
                try {
                    ClientRepresentation client = keycloakClient.realm(realm)
                            .clients()
                            .findByClientId(clientId)
                            .getFirst();

                    String clientUuid = client.getId();

                    RoleRepresentation clientRole = keycloakClient.realm(realm)
                            .clients()
                            .get(clientUuid)
                            .roles()
                            .get(role.name())
                            .toRepresentation();

                    userResource.get(userId)
                            .roles()
                            .clientLevel(clientUuid)
                            .add(Collections.singletonList(clientRole));

                    log.info("Nadano rolę ROLE_CLIENT użytkownikowi: {}", userId);
                } catch (Exception e) {
                    log.error("Error while creating user", e);
                }

                if (role == Role.ROLE_SUPPLIER) {
                    try {
                        userResource.get(userId).executeActionsEmail(List.of("VERIFY_EMAIL"));
                        log.info("Wysłano email weryfikacyjny do: {}", request.email());
                    } catch (Exception e) {
                        log.error("Nie udało się wysłać maila weryfikacyjnego!", e);
                    }
                }

                return UUID.fromString(userId);
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

    @Override
    public void deleteUser(UUID keycloakId) {
        String userId = String.valueOf(keycloakId);

        try {
            keycloakClient.realm(realm).users().get(userId).remove();

            log.info("Successfully deleted user from Keycloak: {}", userId);

        } catch (NotFoundException e) {
            log.warn("User with id {} not found in Keycloak during deletion (already deleted?)", userId);

        } catch (WebApplicationException e) {
            try (var response = e.getResponse()) {
                String errorBody = response.hasEntity() ? response.readEntity(String.class) : "";
                log.error("Cannot delete user {} from Keycloak. Status: {}, Error: {}",
                        userId, response.getStatus(), errorBody);
            }

        } catch (Exception e) {
            log.error("Unexpected error while deleting user from Keycloak: {}", userId, e);
        }
    }


    private UserRepresentation getUserRepresentation(UserProfileRequest request, Role role) {
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.email());
        user.setEmail(request.email());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmailVerified(role == Role.ROLE_SUPPLIER);
        user.singleAttribute("phoneNumber", request.phoneNumber());

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.password());
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));
        return user;
    }

    private AuthResponse sendTokenRequest(MultiValueMap<String, String> requestBody, String tokenUrl) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);

        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, httpEntity, Map.class);
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        if (body == null) throw new RuntimeException("Empty response from keycloak");

        return new AuthResponse(
                (String) body.get("access_token"),
                (String) body.get("refresh_token"),
                (String) body.get("token_type"),
                (Integer) body.get("expires_in")
        );
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        try {
            String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("grant_type", "password");
            map.add("username", request.email());
            map.add("password", request.password());

            return sendTokenRequest(map, tokenUrl);
        } catch (Exception e) {
            log.error("Error while login", e);
            throw new RuntimeException("Nieprawidłowe dane logowania lub błąd serwera");
        }
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        try {
            String tokenUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("grant_type", "refresh_token");
            map.add("refresh_token", request.refreshToken());

            return sendTokenRequest(map, tokenUrl);
        } catch (Exception e) {
            log.error("Error while refresh token", e);
            throw new RuntimeException("Nie udało się odświeżyć tokena");
        }
    }

    @Override
    public void logout(RefreshTokenRequest request) {
        try {
            String revokeUrl = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/revoke";
            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("client_id", clientId);
            map.add("client_secret", clientSecret);
            map.add("token", request.refreshToken());
            map.add("token_type_hint", "refresh_token");
            sendRevokeRequest(map, revokeUrl);
        } catch (Exception e) {
            log.error("Error while logout", e);
            throw new RuntimeException("Nie udało się wylogować");
        }
    }

    private void sendRevokeRequest(MultiValueMap<String, String> requestBody, String url) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Void> response = restTemplate.postForEntity(url, httpEntity, Void.class);
        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("Logout failed with status: " + response.getStatusCode());
        }
    }
}
