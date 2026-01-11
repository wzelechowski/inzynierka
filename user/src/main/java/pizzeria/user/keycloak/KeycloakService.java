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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pizzeria.user.userProfile.dto.request.UserProfileRequest;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class KeycloakService {
    private final Keycloak keycloakClient;

    @Value("${keycloak.realm}")
    private String realm;

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
