import { api } from "../api/api";
import { PromotionResponse } from "../types/promotion";
import { Platform } from "react-native";

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

export const PromotionService = {
    getActivePromotions: async (): Promise<PromotionResponse[]> => {
        try {
            const response = await api.get<PromotionResponse[]>('/promotion/active');
            return response.data;
        } catch (error) {
            console.error('PromotionService Error:', error);
            return [];
        }
    },
};