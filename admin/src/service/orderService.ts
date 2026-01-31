import { api as axiosInstance } from '../api/api';
import type { OrderRequest, OrderResponse } from '../types/order';

export const OrderService = {
    
    getAll: async (): Promise<OrderResponse[]> => {
        const response = await axiosInstance.get<OrderResponse[]>('/order/orders'); 
        return response.data;
    },

    getOne: async (id: string): Promise<OrderResponse | null> => {
        const response = await axiosInstance.get<OrderResponse>(`/order/orders/${id}`);
        return response.data;
    },
    
   update: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/order/orders/${id}`, data);
        return response.data;
    },
    
    create: async (data: OrderRequest) => {
        if (data.type === 'DELIVERY') {
            const response = await axiosInstance.post(`/order/orders/delivery`, data);
            return response.data;
        } else {
            const response = await axiosInstance.post(`/order/orders`, data);
            return response.data;
        }
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/order/orders/${id}`);
        return response.data;
    }
};