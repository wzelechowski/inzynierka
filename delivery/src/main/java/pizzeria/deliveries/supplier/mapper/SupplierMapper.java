package pizzeria.deliveries.supplier.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pizzeria.deliveries.supplier.dto.request.SupplierPatchRequest;
import pizzeria.deliveries.supplier.dto.request.SupplierRequest;
import pizzeria.deliveries.supplier.dto.response.SupplierResponse;
import pizzeria.deliveries.supplier.model.Supplier;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    SupplierResponse toResponse(Supplier supplier);

    Supplier toEntity(SupplierRequest supplierRequest);

    void updateEntity(@MappingTarget Supplier supplier, SupplierRequest supplierRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchEntity(@MappingTarget Supplier supplier, SupplierPatchRequest supplierRequest);
}
