export type EffectType = 'PERCENT' | 'FIXED' | 'FREE_PRODUCT';

export type ProposalProductRole = 'ANTECEDENT' | 'CONSEQUENT';

export type ItemType = 'PIZZA' | 'DRINK' | 'EXTRA'

export type OrderType = 'ON_SITE' | 'TAKE_AWAY' | 'DELIVERY'

export type OrderStatus = 'NEW' | 'IN_PREPARATION' | 'READY' | 'DELIVERY' | 'COMPLETED' | 'CANCELLED'

export type SupplierStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export enum DeliveryStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    PICKED_UP = 'PICKED_UP',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum Role {
  CLIENT = 'ROLE_CLIENT',
  SUPPLIER = 'ROLE_SUPPLIER'
}