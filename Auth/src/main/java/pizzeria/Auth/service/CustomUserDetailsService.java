package pizzeria.auth.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import pizzeria.auth.repository.UserCredentialRepository;

import java.util.ArrayList;

public class CustomUserDetailsService implements UserDetailsService {
    private final UserCredentialRepository userCredentialRepository;

    public CustomUserDetailsService(UserCredentialRepository userCredentialRepository) {
        this.userCredentialRepository = userCredentialRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userCredentialRepository.findByUsername(username)
                .map(user -> new User(
                        user.getUsername(),
                        user.getPassword(),
                        new ArrayList<>()
                ))
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }
}
