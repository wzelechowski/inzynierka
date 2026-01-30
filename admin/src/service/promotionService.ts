import { api as axiosInstance } from '../api/api';
import type { PromotionResponse, PromotionRequest } from '../types/promotion';

export const PromotionService = {
    
    getAll: async (): Promise<PromotionResponse[]> => {
        const response = await axiosInstance.get<PromotionResponse[]>('/promotion/'); 
        return response.data;
    },

    getOne: async (id: string): Promise<PromotionResponse | null> => {
        const response = await axiosInstance.get<PromotionResponse>(`/promotion/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: PromotionRequest) => {
        const response = await axiosInstance.put(`/promotion/${id}`, data);
        return response.data;
    },
    
    create: async (data: PromotionRequest) => {
        const response = await axiosInstance.post(`/promotion/`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/promotion/${id}`);
        return response.data;
    }
};