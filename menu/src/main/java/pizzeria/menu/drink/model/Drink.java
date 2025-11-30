package pizzeria.menu.drink.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "drinks")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Drink {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private Double volume;
}
