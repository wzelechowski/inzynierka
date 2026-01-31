package pizzeria.deliveries.supplier.messaging.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pizzeria.deliveries.config.RabbitConfig;
import pizzeria.deliveries.supplier.dto.request.SupplierRequest;
import pizzeria.deliveries.supplier.dto.response.SupplierResponse;
import pizzeria.deliveries.supplier.messaging.event.SupplierCreatedEvent;
import pizzeria.deliveries.supplier.messaging.event.SupplierDeletedEvent;
import pizzeria.deliveries.supplier.messaging.mapper.SupplierEventMapper;
import pizzeria.deliveries.supplier.service.SupplierService;

@Service
@RequiredArgsConstructor
public class SupplierListener {

    private final SupplierService supplierService;
    private final SupplierEventMapper supplierEventMapper;

    @RabbitListener(queues = RabbitConfig.SUPPLIER_QUEUE)
    public void supplierCreated(SupplierCreatedEvent event) {
        SupplierRequest request = supplierEventMapper.toCreatedRequest(event);
        supplierService.save(request);
    }

    @RabbitListener(queues = RabbitConfig.SUPPLIER_QUEUE)
    public void supplierDeleted(SupplierDeletedEvent event) {
        SupplierResponse response = supplierService.getSupplierByUserProfileId(event.userProfileId());
        supplierService.delete(response.id());
    }
}
