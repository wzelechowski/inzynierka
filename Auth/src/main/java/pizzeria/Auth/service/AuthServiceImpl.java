package pizzeria.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pizzeria.auth.model.UserCredential;
import pizzeria.auth.repository.UserCredentialRepository;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserCredentialRepository userCredentialRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserCredentialRepository userCredentialRepository, PasswordEncoder passwordEncoder) {
        this.userCredentialRepository = userCredentialRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public UserCredential save(UserCredential userCredential) {
        userCredential.setPassword(passwordEncoder.encode(userCredential.getPassword()));
        return userCredentialRepository.save(userCredential);
    }
}
