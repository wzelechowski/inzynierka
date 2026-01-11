package pizzeria.user.address.model;

import jakarta.persistence.*;
import lombok.*;
import pizzeria.user.userProfile.model.UserProfile;

import java.util.UUID;

@Entity
@Table(name = "addresses")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String street;
    private String buildingNumber;
    private String flatNumber;
    private String city;
    private String postalCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserProfile user;
}