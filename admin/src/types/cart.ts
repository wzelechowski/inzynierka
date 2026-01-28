import { OrderItemRequest, OrderItemResponse } from "./order";

export interface CartCalculateRequest {
    orderItems: OrderItemRequest[];
}

export interface CartCalculateResponse {
    totalPrice: number;
    orderItems: OrderItemResponse[];
    promotionIds: string[];
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    internalKey?: string;
}