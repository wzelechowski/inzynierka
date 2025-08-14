package pizzeria.menu.payloads.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ExtraResponse {
    private Long id;
    private String name;
    private Double price;
}
