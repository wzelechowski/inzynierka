package pizzeria.menu.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pizzeria.menu.mapper.ExtraMapper;
import pizzeria.menu.model.Extra;
import pizzeria.menu.payloads.request.ExtraPatchRequest;
import pizzeria.menu.payloads.request.ExtraRequest;
import pizzeria.menu.payloads.response.ExtraResponse;
import pizzeria.menu.service.ExtraService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/extras")
public class ExtraController {
    private final ExtraService extraService;
    private final ExtraMapper extraMapper;

    public ExtraController(ExtraService extraService, ExtraMapper extraMapper) {
        this.extraService = extraService;
        this.extraMapper = extraMapper;
    }

    @GetMapping("")
    public ResponseEntity<List<ExtraResponse>> getExtrasById() {
        List<Extra> extras = extraService.getAllExtras();
        if (extras.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<ExtraResponse> response = extras.stream()
                .map(extraMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExtraResponse> getExtraById(@PathVariable Long id) {
        Optional<Extra> extra = extraService.getExtraById(id);
        if (extra.isPresent()) {
            ExtraResponse response = extraMapper.toResponse(extra.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("")
    public ResponseEntity<ExtraResponse> createExtra(@Valid @RequestBody ExtraRequest request) {
        Extra extra = extraService.save(request);
        ExtraResponse response = extraMapper.toResponse(extra);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ExtraResponse> deleteExtra(@PathVariable Long id) {
        Optional<Extra> extra = extraService.delete(id);
        if (extra.isPresent()) {
            ExtraResponse response = extraMapper.toResponse(extra.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExtraResponse> updateExtra(@PathVariable Long id, @Valid @RequestBody ExtraRequest request) {
        Optional<Extra> extra = extraService.update(id, request);
        if (extra.isPresent()) {
            ExtraResponse response = extraMapper.toResponse(extra.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ExtraResponse> patchExtra(@PathVariable Long id, @Valid @RequestBody ExtraPatchRequest request) {
        Optional<Extra> extra = extraService.patch(id, request);
        if (extra.isPresent()) {
            ExtraResponse response = extraMapper.toResponse(extra.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }
}
