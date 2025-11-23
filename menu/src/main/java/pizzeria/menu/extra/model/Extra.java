package pizzeria.menu.extra.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "extra")
@NoArgsConstructor
@Data
public class Extra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;
}
