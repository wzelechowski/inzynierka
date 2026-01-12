import { PromotionResponse } from "../types/promotion";
import { Platform } from "react-native";

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

const API_URL = `${BASE_URL}/api/v1/promotion`; 

export const PromotionService = {
    getActivePromotions: async (): Promise<PromotionResponse[]> => {
        try {
            const response = await fetch(`${API_URL}/active`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Błąd pobierania promocji: ${response.status}`);
            }

            const data: PromotionResponse[] = await response.json();
            return data;

        } catch (error) {
            console.error('PromotionService Error:', error);
            return [];
        }
    },
};