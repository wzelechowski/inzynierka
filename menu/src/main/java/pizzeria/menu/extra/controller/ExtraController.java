package pizzeria.menu.extra.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.extra.dto.request.ExtraPatchRequest;
import pizzeria.menu.extra.dto.request.ExtraRequest;
import pizzeria.menu.extra.dto.response.ExtraResponse;
import pizzeria.menu.extra.service.ExtraService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/extras")
public class ExtraController {
    private final ExtraService extraService;

    public ExtraController(ExtraService extraService) {
        this.extraService = extraService;
    }

    @GetMapping("")
    public ResponseEntity<List<ExtraResponse>> getExtrasById() {
        List<ExtraResponse> response = extraService.getAllExtras();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExtraResponse> getExtraById(@PathVariable UUID id) {
        ExtraResponse response = extraService.getExtraById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<ExtraResponse> createExtra(@Valid @RequestBody ExtraRequest request) {
        ExtraResponse response = extraService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ExtraResponse> deleteExtra(@PathVariable UUID id) {
        extraService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExtraResponse> updateExtra(@PathVariable UUID id, @Valid @RequestBody ExtraRequest request) {
        ExtraResponse response = extraService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ExtraResponse> patchExtra(@PathVariable UUID id, @Valid @RequestBody ExtraPatchRequest request) {
        ExtraResponse response = extraService.patch(id, request);
        return ResponseEntity.ok(response);
    }
}
