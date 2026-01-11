package pizzeria.user.userProfile.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserProfileRequest(
        @NotBlank(message = "First name cannot be empty")
        @Size(min = 2, max = 30)
        String firstName,

        @NotBlank(message = "Last name cannot be empty")
        @Size(min = 2, max = 30)
        String lastName,

        @NotBlank(message = "Email cannot be empty")
        @Email
        String email,

        @NotBlank(message = "Phone number cannot be empty")
        @Pattern(regexp = "\\+?[0-9]{9,15}", message = "Phone number is invalid")
        String phoneNumber,

        @NotBlank
        String password
) {}
