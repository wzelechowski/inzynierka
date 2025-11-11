package pizzeria.auth.service;

import pizzeria.auth.model.UserCredential;

public interface AuthService {
    UserCredential save(UserCredential userCredential);
}
