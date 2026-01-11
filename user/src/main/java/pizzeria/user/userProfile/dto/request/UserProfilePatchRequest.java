package pizzeria.user.userProfile.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserProfilePatchRequest(
        @Size(min = 2, max = 30)
        String firstName,

        @Size(min = 2, max = 30)
        String lastName,

        @Email
        String email,

        @Pattern(regexp = "\\+?[0-9]{9,15}", message = "Phone number is invalid")
        String phoneNumber
) {}
