import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from '../api/api';
import { OrderDeliveryRequest, OrderRequest, OrderResponse } from "../types/order";

export const OrderService = {
    createOrder: async (request: OrderRequest | OrderDeliveryRequest): Promise<OrderResponse> => {
        try {
            const isDelivery = 'deliveryAddress' in request;
            const endpointSuffix = isDelivery ? '/delivery' : '';
            
            const url = `/order/orders${endpointSuffix}`;
            
            const response = await api.post<OrderResponse>(url, request);

            await AsyncStorage.removeItem('@pizzeria_cart_v1');

            return response.data;

        } catch (error: any) {
            console.error('Order-Service Error:', error);
            const message = error.response?.data || error.message;
            throw new Error(`Nie udało się złożyć zamówienia: ${message}`);
        }
    },

    getOrders: async (): Promise<OrderResponse[]> => {
        try {
            const response = await api.get<OrderResponse[]>('/order/orders');
            
            return response.data;
        } catch (error: any) {
            console.error('Order-Service Error:', error);
            const message = error.response?.data || error.message;
            throw new Error(`Nie udało się pobrać zamówień: ${message}`);
        }
    },
    getOrderById: async (id: string): Promise<OrderResponse> => {
        try {
            const response = await api.get<OrderResponse>(`/order/orders/${id}`);
            return response.data;
        } catch (error: any) {
            console.error('Order-Service Error:', error);
            throw new Error(`Nie udało się pobrać szczegółów zamówienia.`);
        }
    }
};