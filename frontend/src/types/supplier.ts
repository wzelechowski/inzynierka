import { SupplierStatus } from "./enums";

export interface SupplierResponse {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: SupplierStatus;
}

export interface SupplierChangeStatusRequest {
    status: SupplierStatus;
}

