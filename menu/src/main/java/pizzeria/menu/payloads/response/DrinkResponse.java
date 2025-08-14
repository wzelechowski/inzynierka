package pizzeria.menu.payloads.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class DrinkResponse {
    private Long id;
    private String name;
    private Double price;
    private Double volume;
}
