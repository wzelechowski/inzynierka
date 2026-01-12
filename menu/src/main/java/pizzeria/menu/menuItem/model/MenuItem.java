package pizzeria.menu.menuItem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "menu_items")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID itemId;

    @Enumerated(EnumType.STRING)
    ItemType type;

    private String name;
    private String description;
    private BigDecimal basePrice;

    @Builder.Default
    private Boolean isAvailable = true;
}
