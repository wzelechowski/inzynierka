package pizzeria.menu.payloads.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ExtraPatchRequest {
    @Size(min = 2, max = 30)
    private String name;

    @Positive
    @Digits(integer = 3, fraction = 2)
    private Double price;
}
