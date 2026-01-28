import { api as axiosInstance } from '../api/api';
import type { PromotionResponse } from '../types/promotion';

export const PromotionService = {
    
    getAll: async (): Promise<PromotionResponse[]> => {
        const response = await axiosInstance.get<PromotionResponse[]>('/promotion/'); 
        return response.data;
    },

    getOne: async (id: string): Promise<PromotionResponse | null> => {
        const response = await axiosInstance.get<PromotionResponse>(`/promotion/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/promotion/${id}`, data);
        return response.data;
    },
    
    create: async (data: any) => {
        const response = await axiosInstance.post(`/promotion`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/promotion/${id}`);
        return response.data;
    }
};