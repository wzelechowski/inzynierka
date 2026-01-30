import { api as axiosInstance } from '../api/api';
import type { IngredientResponse, IngredientRequest } from '../types/menu';

export const IngredientService = {
    
    getAll: async (): Promise<IngredientResponse[]> => {
        const response = await axiosInstance.get<IngredientResponse[]>('/menu/ingredients'); 
        return response.data;
    },

    getOne: async (id: string): Promise<IngredientResponse | null> => {
        const response = await axiosInstance.get<IngredientResponse>(`/menu/ingredients/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: IngredientRequest) => {
        const response = await axiosInstance.put(`/menu/ingredients/${id}`, data);
        return response.data;
    },
    
    create: async (data: IngredientRequest) => {
        const response = await axiosInstance.post(`/menu/ingredients`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/menu/ingredients/${id}`);
        return response.data;
    }
};