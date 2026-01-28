import { DeliveryStatus } from "./enums";
import type{ SupplierResponse } from "./supplier";

export interface DeliveryResponse {
    id: string;
    orderId: string;
    supplier: SupplierResponse;
    status: DeliveryStatus;
    deliveryAddress: string;
    deliveryCity: string;
    postalCode: string;
    assignedAt: string;
    pickedUpAt: string;
    deliveredAt: string;
}


export interface DeliverySupplierAssignRequest {
    supplierId: string;
}

export interface DeliveryChangeStatusRequest {
    status: DeliveryStatus;
}
