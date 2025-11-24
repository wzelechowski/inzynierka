package pizzeria.menu.extra.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ExtraPatchRequest(
        @Size(min = 2, max = 30)
        String name,

        @Positive
        @Digits(integer = 3, fraction = 2)
        Double weight
){}
