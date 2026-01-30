import { api } from '../api/api';
import type { CartCalculateRequest, CartCalculateResponse } from "../types/cart";

export const CartService = {
    calculateCart: async (request: CartCalculateRequest): Promise<CartCalculateResponse> => {
        try {
            const response = await api.post<CartCalculateResponse>('/order/cart/calculate', request);
            
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Order-Service Error:', error);
            throw error; 
        }
    },
};