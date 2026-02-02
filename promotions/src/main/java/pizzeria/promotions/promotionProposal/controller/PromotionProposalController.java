package pizzeria.promotions.promotionProposal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalPatchRequest;
import pizzeria.promotions.promotionProposal.dto.request.PromotionProposalRequest;
import pizzeria.promotions.promotionProposal.dto.response.PromotionProposalResponse;
import pizzeria.promotions.promotionProposal.service.PromotionProposalService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/promotionProposal")
@RequiredArgsConstructor
public class PromotionProposalController {

    private final PromotionProposalService promotionProposalService;

    @GetMapping("/")
    public ResponseEntity<List<PromotionProposalResponse>> getAllPromotionProposals() {
        List<PromotionProposalResponse> response = promotionProposalService.getAllProposals();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromotionProposalResponse> getPromotionProposal(@PathVariable UUID id) {
        PromotionProposalResponse response = promotionProposalService.getProposalById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<PromotionProposalResponse> createPromotionProposal(
            @Valid @RequestBody PromotionProposalRequest request
    ) {
        PromotionProposalResponse response = promotionProposalService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<PromotionProposalResponse> deletePromotionProposal(@PathVariable UUID id) {
        promotionProposalService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionProposalResponse> updatePromotionProposal(
            @PathVariable UUID id, @Valid @RequestBody PromotionProposalRequest request
    ) {
        PromotionProposalResponse response = promotionProposalService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PromotionProposalResponse> patchPromotionProposal(
            @PathVariable UUID id, @Valid @RequestBody PromotionProposalPatchRequest request
    ) {
        PromotionProposalResponse response = promotionProposalService.patch(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/generate")
    public ResponseEntity<Void> generatePromotionProposal(@RequestParam(name = "max_proposals", defaultValue = "5") Integer maxProposals,
                                                          @RequestParam(name = "days_back", defaultValue = "21") Integer daysBack) {
        promotionProposalService.generate(maxProposals, daysBack);
        return ResponseEntity.noContent().build();
    }
}
