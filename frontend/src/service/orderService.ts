import { Platform } from "react-native";
import { OrderDeliveryRequest, OrderRequest, OrderResponse } from "../types/order";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

const API_URL = `${BASE_URL}/api/v1/order/orders`; 

export const OrderService = {
    createOrder: async (request: OrderRequest | OrderDeliveryRequest): Promise<OrderResponse> => {
       const token = await AsyncStorage.getItem('auth_access_token');
        try {
            const isDelivery = 'deliveryAddress' in request;
            
            const endpoint = isDelivery ? '/delivery' : ''; 
            
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Błąd ${response.status}: ${errorText}`);
            }

            AsyncStorage.removeItem('@pizzeria_cart_v1');
            return await response.json();

        } catch (error) {
            console.error('Order-Service Error:', error);
            throw error;
        }
    },
};