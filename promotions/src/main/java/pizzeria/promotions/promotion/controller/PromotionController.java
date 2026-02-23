package pizzeria.promotions.promotion.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.promotions.promotion.dto.request.PromotionCheckRequest;
import pizzeria.promotions.promotion.dto.request.PromotionPatchRequest;
import pizzeria.promotions.promotion.dto.request.PromotionRequest;
import pizzeria.promotions.promotion.dto.response.PromotionCheckResponse;
import pizzeria.promotions.promotion.dto.response.PromotionResponse;
import pizzeria.promotions.promotion.service.PromotionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService promotionService;

    @GetMapping("")
    public ResponseEntity<List<PromotionResponse>> getAllPromotions() {
        List<PromotionResponse> response = promotionService.getAllPromotions();
        return  ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PromotionResponse>> getActivePromotions() {
        List<PromotionResponse> response = promotionService.getActivePromotions();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionResponse> getPromotionById(@PathVariable UUID id) {
        PromotionResponse response = promotionService.getPromotionById(id);
        return  ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<PromotionResponse> createPromotion(@Valid @RequestBody PromotionRequest request) {
        PromotionResponse response = promotionService.save(request);
        return  ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PromotionResponse> deletePromotion(@PathVariable UUID id) {
        promotionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionResponse> updatePromotion(@PathVariable UUID id, @Valid @RequestBody PromotionRequest request) {
        PromotionResponse response = promotionService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PromotionResponse> patchPromotion(@PathVariable UUID id, @Valid @RequestBody PromotionPatchRequest request) {
        PromotionResponse response = promotionService.patch(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check")
    public ResponseEntity<PromotionCheckResponse> checkPromotion(@Valid @RequestBody PromotionCheckRequest request) {
        PromotionCheckResponse response = promotionService.checkPromotion(request);
        return ResponseEntity.ok(response);
    }
}
