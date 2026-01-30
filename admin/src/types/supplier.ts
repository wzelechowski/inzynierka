import type { SupplierStatus } from "./enums";

export interface SupplierResponse {
    id: string;
    userProfileId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: SupplierStatus;
}

export interface SupplierChangeStatusRequest {
    status: SupplierStatus;
}

