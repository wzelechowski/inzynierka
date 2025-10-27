//package pizzeria.menu.model;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Table(name = "promotion_item")
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Builder
//public class PromotionItem {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @MapsId("itemId")
//    @JoinColumn(name = "item_id")
//    private Item item;
//
//    @ManyToOne
//    @MapsId("promotionId")
//    @JoinColumn(name = "promotion_id")
//    private Promotion promotion;
//
//    @Column(name = "discount")
//    private Double discount;
//}
