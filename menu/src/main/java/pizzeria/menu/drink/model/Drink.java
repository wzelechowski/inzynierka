package pizzeria.menu.drink.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "drink")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Drink {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "volume")
    private Double volume;
}
