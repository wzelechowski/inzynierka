package pizzeria.menu.service;

import pizzeria.menu.model.Extra;
import pizzeria.menu.payloads.request.ExtraPatchRequest;
import pizzeria.menu.payloads.request.ExtraRequest;

import java.util.List;
import java.util.Optional;

public interface ExtraService {
    List<Extra> getAllExtras();

    Optional<Extra> getExtraById(Long id);

    Extra save(ExtraRequest request);

    Optional<Extra> delete(Long id);

    Optional<Extra> update(Long id, ExtraRequest request);

    Optional<Extra> patch(Long id, ExtraPatchRequest request);
}
