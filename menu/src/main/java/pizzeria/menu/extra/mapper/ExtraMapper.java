package pizzeria.menu.extra.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pizzeria.menu.extra.dto.request.ExtraPatchRequest;
import pizzeria.menu.extra.model.Extra;
import pizzeria.menu.extra.dto.request.ExtraRequest;
import pizzeria.menu.extra.dto.response.ExtraResponse;

@Mapper(componentModel = "spring")
public interface ExtraMapper {
    ExtraResponse toResponse(Extra extra);

    Extra toEntity(ExtraRequest request);

    void updateEntity(@MappingTarget Extra extra, ExtraRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget Extra extra, ExtraPatchRequest request);
}
