import { MenuItemResponse } from "../types/menuItem";
import { Platform } from "react-native";

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

const API_URL = `${BASE_URL}/api/v1/menu/menuItems`; 

export const MenuItemService = {
    getAvailableMenuItems: async (): Promise<MenuItemResponse[]> => {
        try {
            const response = await fetch(`${API_URL}/available`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Błąd pobierania menuItem: ${response.status}`);
            }

            const data: MenuItemResponse[] = await response.json();
            return data;

        } catch (error) {
            console.error('Menu-Service Error:', error);
            return [];
        }
    },
    getMenuItemById: async (id: String): Promise<MenuItemResponse | null> => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Błąd pobierania produktu ${id}: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`MenuService Error (id: ${id}):`, error);
            return null;
        }
    }
};