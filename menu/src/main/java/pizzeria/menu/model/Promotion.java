//package pizzeria.menu.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Entity
//@Table(name = "promotion")
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//public class Promotion {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Long id;
//
//    @Column(name = "name")
//    private String name;
//
//    @Column(name = "start_date")
//    private LocalDate startDate;
//
//    @Column(name = "end_date")
//    private LocalDate endDate;
//
//    @Column(name = "promotionCode")
//    private String promotionCode;
//
//    @Column(name = "minItemCount")
//    private Integer minItemCount;
//
//    @Column(name = "maxItemCount")
//    private Integer maxItemCount;
//
//    @OneToMany(mappedBy = "promotion", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<PromotionItem> promotionItems;
//}
