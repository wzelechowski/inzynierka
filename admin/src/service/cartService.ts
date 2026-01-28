import { api } from '../api/api';
import { CartCalculateRequest, CartCalculateResponse } from "../types/cart";

export const CartService = {
    calculateCart: async (request: CartCalculateRequest): Promise<CartCalculateResponse> => {
        try {
            const response = await api.post<CartCalculateResponse>('/order/cart/calculate', request);
            
            return response.data;
        } catch (error) {
            console.error('Order-Service Error:', error);
            throw error; 
        }
    },
};