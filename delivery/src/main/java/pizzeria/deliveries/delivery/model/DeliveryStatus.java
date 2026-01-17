package pizzeria.deliveries.delivery.model;

public enum DeliveryStatus {
    PENDING, ASSIGNED, PICKED_UP, DELIVERED, CANCELLED;

    public boolean canTransitionTo(DeliveryStatus target) {
        return switch (this) {
            case PENDING -> target == ASSIGNED;
            case ASSIGNED -> target == PICKED_UP || target == PENDING || target == CANCELLED;
            case PICKED_UP -> target == DELIVERED;
            default -> false;
        };
    }
}
