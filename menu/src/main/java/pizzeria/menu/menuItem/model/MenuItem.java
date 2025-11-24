package pizzeria.menu.menuItem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "menuItem")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;

    @Column(name = "itemId", nullable = false)
    private UUID itemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    ItemType type;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(nullable = false)
    private BigDecimal basePrice;

    @Column(name = "isAvailable", nullable = false)
    private Boolean isAvailable = true;
}
