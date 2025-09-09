package pizzeria.auth.service;

import io.jsonwebtoken.Claims;

import java.util.Date;

public interface JwtService {
    void init();

    Claims getAllClaimsFromToken(String token);

    Date getExpirationDateFromToken(String token);

    String generate(String email, String type);

    Boolean validateToken(String token);
}
