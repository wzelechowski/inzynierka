package pizzeria.user.userProfile.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import pizzeria.user.userProfile.dto.event.CreateSupplierDomainEvent;
import pizzeria.user.userProfile.dto.event.DeleteSupplierDomainEvent;
import pizzeria.user.userProfile.messaging.event.SupplierCreatedEvent;
import pizzeria.user.userProfile.messaging.event.SupplierDeletedEvent;
import pizzeria.user.userProfile.messaging.publisher.UserProfileEventPublisher;

@Component
@RequiredArgsConstructor
public class DomainListener {
    private final UserProfileEventPublisher userProfileEventPublisher;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onSupplierCreated(CreateSupplierDomainEvent domainEvent) {
        var event = new SupplierCreatedEvent(
                domainEvent.userProfileId(),
                domainEvent.firstName(),
                domainEvent.lastName(),
                domainEvent.phoneNumber()
        );

        userProfileEventPublisher.publishSupplierCreated(event);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onSupplierDeleted(DeleteSupplierDomainEvent domainEvent) {
        var event = new SupplierDeletedEvent(domainEvent.userProfileId());
        userProfileEventPublisher.publishSupplierDeleted(event);
    }
}
