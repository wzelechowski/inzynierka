import { api } from '../api/api';
import { MenuItemResponse } from "../types/menuItem";

export const MenuItemService = {
    getAvailableMenuItems: async (): Promise<MenuItemResponse[]> => {
        try {
            const response = await api.get<MenuItemResponse[]>('/menu/menuItems/available');
            
            return response.data;
        } catch (error) {
            console.error('Menu-Service Error:', error);
            return [];
        }
    },

    getMenuItemById: async (id: String): Promise<MenuItemResponse | null> => {
        try {
            const response = await api.get<MenuItemResponse>(`/menu/menuItems/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            
            console.error(`MenuService Error (id: ${id}):`, error);
            return null;
        }
    }
};