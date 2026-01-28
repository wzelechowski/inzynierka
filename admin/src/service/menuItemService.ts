import { api as axiosInstance } from '../api/api';
import type { MenuItemResponse } from '../types/menuItem';

export const MenuItemService = {
    
    getAll: async (): Promise<MenuItemResponse[]> => {
        const response = await axiosInstance.get<MenuItemResponse[]>('/menu/menuItems'); 
        return response.data;
    },

    getOne: async (id: string): Promise<MenuItemResponse | null> => {
        const response = await axiosInstance.get<MenuItemResponse>(`/menu/menuItems/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/menu/menuItems/${id}`, data);
        return response.data;
    },
    
    create: async (data: any) => {
        const response = await axiosInstance.post(`/menu/menuItems`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/menu/menuItems/${id}`);
        return response.data;
    }
};