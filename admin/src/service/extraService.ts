import { api as axiosInstance } from '../api/api';
import type { ExtraResponse, ExtraRequest } from '../types/menu';

export const ExtraService = {
    
    getAll: async (): Promise<ExtraResponse[]> => {
        const response = await axiosInstance.get<ExtraResponse[]>('/menu/extras'); 
        return response.data;
    },

    getOne: async (id: string): Promise<ExtraResponse | null> => {
        const response = await axiosInstance.get<ExtraResponse>(`/menu/extras/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: ExtraRequest) => {
        const response = await axiosInstance.put(`/menu/extras/${id}`, data);
        return response.data;
    },
    
    create: async (data: ExtraRequest) => {
        const response = await axiosInstance.post(`/menu/extras`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/menu/extras/${id}`);
        return response.data;
    }
};