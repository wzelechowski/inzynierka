package pizzeria.menu.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drink")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Drink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "volume")
    private Double volume;
}
