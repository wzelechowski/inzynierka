package pizzeria.menu.extra.service;

import pizzeria.menu.extra.dto.response.ExtraResponse;
import pizzeria.menu.extra.dto.request.ExtraPatchRequest;
import pizzeria.menu.extra.dto.request.ExtraRequest;

import java.util.List;

public interface ExtraService {
    List<ExtraResponse> getAllExtras();

    ExtraResponse getExtraById(Long id);

    ExtraResponse save(ExtraRequest request);

    void delete(Long id);

    ExtraResponse update(Long id, ExtraRequest request);

    ExtraResponse patch(Long id, ExtraPatchRequest request);
}
