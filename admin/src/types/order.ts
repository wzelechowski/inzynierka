import type { OrderStatus, OrderType } from "./enums";

export interface OrderItemRequest {
    itemId: string;
    quantity: number;
}

export interface OrderItemResponse {
    orderId: string;
    itemId: string;
    quantity: number;
    basePrice: number;
    finalPrice: number;
    totalPrice: number;
    discounted: boolean;
}

export interface OrderDeliveryRequest {
    type: OrderType;
    orderItems: OrderItemRequest[];
    deliveryAddress: string;
    deliveryCity: string;
    postalCode: string;
}

export interface OrderRequest {
    type: OrderType;
    orderItems: OrderItemRequest[];
}

export interface OrderResponse {
    id: string;
    status: OrderStatus;
    type: OrderType;
    totalPrice: number;
    createdAt: string;
    completedAt: string;
    orderItems: OrderItemResponse[];
}
