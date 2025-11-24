package pizzeria.menu.extra.service;

import pizzeria.menu.extra.dto.response.ExtraResponse;
import pizzeria.menu.extra.dto.request.ExtraPatchRequest;
import pizzeria.menu.extra.dto.request.ExtraRequest;

import java.util.List;
import java.util.UUID;

public interface ExtraService {
    List<ExtraResponse> getAllExtras();

    ExtraResponse getExtraById(UUID id);

    ExtraResponse save(ExtraRequest request);

    void delete(UUID id);

    ExtraResponse update(UUID id, ExtraRequest request);

    ExtraResponse patch(UUID id, ExtraPatchRequest request);
}
