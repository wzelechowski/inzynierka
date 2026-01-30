import { api as axiosInstance } from '../api/api';
import type { DrinkResponse, DrinkRequest } from '../types/menu';

export const DrinkService = {
    
    getAll: async (): Promise<DrinkResponse[]> => {
        const response = await axiosInstance.get<DrinkResponse[]>('/menu/drinks'); 
        return response.data;
    },

    getOne: async (id: string): Promise<DrinkResponse | null> => {
        const response = await axiosInstance.get<DrinkResponse>(`/menu/drinks/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: DrinkRequest) => {
        const response = await axiosInstance.put(`/menu/drinks/${id}`, data);
        return response.data;
    },
    
    create: async (data: DrinkRequest) => {
        const response = await axiosInstance.post(`/menu/drinks`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/menu/drinks/${id}`);
        return response.data;
    }
};