import { Platform } from "react-native";
import { CartCalculateRequest, CartCalculateResponse } from "../types/cart";

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

const API_URL = `${BASE_URL}/api/v1/order/cart`; 

export const CartService = {
    calculateCart: async (request: CartCalculateRequest): Promise<CartCalculateResponse> => {
        try {
            const response = await fetch(`${API_URL}/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`Błąd liczenia koszyka: ${response.status}`);
            }

            const data: CartCalculateResponse = await response.json();
            return data;

        } catch (error) {
            console.error('Order-Service Error:', error);
            return error;
        }
    },
};