package pizzeria.menu.payloads.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import pizzeria.menu.model.Size;

@Data
@AllArgsConstructor
@Builder
public class PizzaResponse {
    private Long id;
    private String name;
    private Double price;
    private Size size;
}
