import { api as axiosInstance } from '../api/api';
import type { MenuItemRequest, MenuItemResponse } from '../types/menuItem';

export const MenuItemService = {
    
    getAll: async (): Promise<MenuItemResponse[]> => {
        const response = await axiosInstance.get<MenuItemResponse[]>('/menu/menuItems'); 
        return response.data;
    },

    getOne: async (id: string): Promise<MenuItemResponse | null> => {
        const response = await axiosInstance.get<MenuItemResponse>(`/menu/menuItems/${id}`);
        return response.data;
    },

    getMany: async (ids: string[]): Promise<MenuItemResponse[]> => {
        const response = await axiosInstance.get<MenuItemResponse[]>('/menu/menuItems');
        const allItems = response.data;
        console.log(response);

        return allItems.filter(item => ids.includes(item.id));
    },
    
    update: async (id: string, data: MenuItemRequest) => {
        console.log(data);
        const response = await axiosInstance.put(`/menu/menuItems/${id}`, data);
        return response.data;
    },
    
    create: async (data: MenuItemRequest) => {
        const response = await axiosInstance.post(`/menu/menuItems`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/menu/menuItems/${id}`);
        return response.data;
    }
};