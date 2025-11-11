package pizzeria.auth.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pizzeria.auth.model.UserCredential;
import pizzeria.auth.payloads.request.AuthRequest;
import pizzeria.auth.service.AuthService;
import pizzeria.auth.service.JWTService;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/")
public class AuthController {
    private final AuthService authService;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(AuthService authService, JWTService jwtService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public UserCredential addNewUser(@RequestBody UserCredential userCredential) {
        return authService.save(userCredential);
    }
    @PostMapping("/token")
    public String getToken(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            if (authentication.isAuthenticated()) {
                return jwtService.generateToken(request.username());
            } else {
                throw new UsernameNotFoundException("Username not found");
            }

        } catch (Exception e) {
            e.printStackTrace(); // 👈 zobacz w logach co konkretnie wywala
            throw e;
        }
    }


    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        jwtService.validateToken(token);
        return "Valid";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello";
    }
}
