import { api } from "../api/api";
import { Platform } from "react-native";
import { DeliveryChangeStatusRequest, DeliveryResponse, DeliverySupplierAssignRequest } from "../types/delivery";

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

export const DeliveryService = {
    getPendingDeliveires: async (): Promise<DeliveryResponse[]> => {
        try {
            const response = await api.get<DeliveryResponse[]>('/delivery/pending');
            return response.data;
        } catch (error) {
            return [];
        }
    },

    getMyDeliveries: async(supplierId: string): Promise<DeliveryResponse[]> => {
        try {
            const response = await api.get<DeliveryResponse[]>(`/delivery/?supplierId=${supplierId}`);
            return response.data;
        } catch(error: any) {
            console.error("Błąd pobierania moich dostaw", error);
            return [];
        }
    },

    getDeliveryByOrderId: async(orderId: string): Promise<DeliveryResponse | null> => {
      try {
        const response = await api.get<DeliveryResponse>(`/delivery/order/${orderId}`)
        return response.data;
      } catch (error: any) {
            console.error('Delivery-Service Error:', error);
            const message = error.response?.data || error.message;
            throw new Error(`Nie udało się pobrać dostaw: ${message}`);
      }
    },

    updateSupplier: async (id: string, request: DeliverySupplierAssignRequest): Promise<DeliveryResponse | null> => {
        try {
            const response = await api.put<DeliveryResponse>(`/delivery/${id}/supplier`, request);
            return response.data;
        } catch (error: any) {
            console.error('Delivery-Service Error:', error);
            const message = error.response?.data || error.message;
            throw new Error(`Nie udało się przypisać dostawcy: ${message}`);

        }
    },

    updateStatus: async (id: string, request: DeliveryChangeStatusRequest): Promise<DeliveryResponse | null> => {
        try {
            const response = await api.put<DeliveryResponse>(`/delivery/${id}/status`, request);
            return response.data;
        } catch(error: any) {
            console.error('Delivery-Service Error:', error);
            const message = error.response?.data || error.message;
            throw new Error(`Nie udało się zmienić statusu dostawy: ${message}`);
        }
    }
};