package pizzeria.auth.service;

import pizzeria.auth.model.UserCredential;

public interface JWTService {
   void validateToken(String token);
   String generateToken(String username);
}
