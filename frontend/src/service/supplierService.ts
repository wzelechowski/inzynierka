import { Platform } from "react-native";
import { SupplierChangeStatusRequest, SupplierResponse } from "../types/supplier";
import axios from "axios";
import { api } from "../api/api";

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

export const SupplierService = {
    getSupplier: async (id: string): Promise<SupplierResponse> => {
        try {
            const response = await api.get<SupplierResponse>(`/delivery/suppliers/${id}/user`);
            return response.data;
        } catch(error: any) {
            console.error('Delivery-Service Error:', error);
            const message = error.response?.data || error.message;
            throw new Error(`Nie udało się pobrać dostawcy: ${message}`);
        }
    },
    changeSupplierStatus: async (id: string, request: SupplierChangeStatusRequest): Promise<SupplierResponse> => {
        try {
            const response = await api.put<SupplierResponse>(`/delivery/suppliers/${id}`, request);
            return response.data;
        } catch(error: any) {
            console.error('Delivery-Service Error:', error);
            const message = error.response?.data || error.message;
            throw new Error(`Nie udało się zmienić statusu dostawcy: ${message}`);
        }
    }
};