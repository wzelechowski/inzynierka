import { api as axiosInstance } from '../api/api';
import type { DeliveryResponse } from '../types/delivery';

export const DeliveryService = {
    
    getAll: async (): Promise<DeliveryResponse[]> => {
        const response = await axiosInstance.get<DeliveryResponse[]>('/delivery/'); 
        return response.data;
    },

    getOne: async (id: string): Promise<DeliveryResponse | null> => {
        const response = await axiosInstance.get<DeliveryResponse>(`/delivery/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/delivery/${id}`, data);
        return response.data;
    },
    
    create: async (data: any) => {
        const response = await axiosInstance.post(`/delivery`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/delivery/${id}`);
        return response.data;
    }
};