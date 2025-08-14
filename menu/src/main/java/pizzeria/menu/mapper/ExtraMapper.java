package pizzeria.menu.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import pizzeria.menu.model.Extra;
import pizzeria.menu.payloads.request.ExtraRequest;
import pizzeria.menu.payloads.response.ExtraResponse;

@Mapper(componentModel = "spring")
public interface ExtraMapper {
    ExtraResponse toResponse(Extra extra);

    Extra toEntity(ExtraRequest request);

    void updateEntity(@MappingTarget Extra extra, ExtraRequest request);
}
