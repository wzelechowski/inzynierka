import { api as axiosInstance } from '../api/api';
import type { PizzaRequest, PizzaResponse } from '../types/menu';

export const PizzaService = {
    
    getAll: async (): Promise<PizzaResponse[]> => {
        const response = await axiosInstance.get<PizzaResponse[]>('/menu/pizzas'); 
        return response.data;
    },

    getOne: async (id: string): Promise<PizzaResponse | null> => {
        const response = await axiosInstance.get<PizzaResponse>(`/menu/pizzas/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: PizzaRequest) => {
        const response = await axiosInstance.put(`/menu/pizzas/${id}`, data);
        return response.data;
    },
    
    create: async (data: PizzaRequest) => {
        const response = await axiosInstance.post(`/menu/pizzas`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/menu/pizzas/${id}`);
        return response.data;
    }
};