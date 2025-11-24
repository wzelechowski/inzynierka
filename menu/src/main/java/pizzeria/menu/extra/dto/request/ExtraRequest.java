package pizzeria.menu.extra.dto.request;

import jakarta.validation.constraints.*;

public record ExtraRequest(
        @NotBlank
        @Size(min = 2, max = 30)
        String name,

        @NotNull
        @Positive
        @Digits(integer = 3, fraction = 2)
        Double weight
){}
