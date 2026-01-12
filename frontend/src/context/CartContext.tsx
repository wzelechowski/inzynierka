import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartService } from '../service/cartService';
import { CartItem, CartCalculateRequest } from '../types/cart';
import { OrderItemResponse } from '../types/order';

interface CartContextType {
  items: CartItem[];
  backendItems: OrderItemResponse[];
  addItem: (item: CartItem) => void;
  addItems: (newItems: CartItem[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = '@pizzeria_cart_v1';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [backendItems, setBackendItems] = useState<OrderItemResponse[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (jsonValue) setItems(JSON.parse(jsonValue));
      } catch (e) {
        console.error("Błąd ładowania", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const syncWithBackend = async () => {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

    if (items.length === 0) {
        setTotalPrice(0);
        setBackendItems([]);
        return;
    }

    setIsLoading(true);
    try {
        const request: CartCalculateRequest = {
        orderItems: items.map(i => ({ itemId: i.id, quantity: i.quantity }))
        };

        const response = await CartService.calculateCart(request);
        
        setTotalPrice(response.totalPrice);
        setBackendItems(response.orderItems); 
    } catch (e) {
        console.error("Błąd kalkulacji", e);
    } finally {
        setIsLoading(false);
    }
    };

    const timeoutId = setTimeout(syncWithBackend, 300);
    return () => clearTimeout(timeoutId);
  }, [items, isLoaded]);

  const addItem = (newItem: CartItem) => {
    setItems((curr) => {
      const existing = curr.find(i => i.id === newItem.id);
      if (existing) {
        return curr.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i);
      }
      return [...curr, newItem];
    });
  };

const addItems = (newItems: CartItem[]) => {
  setItems((curr) => {
    const updatedCart = [...curr];
    
    newItems.forEach((newItem) => {
      const existingIndex = updatedCart.findIndex(i => i.id === newItem.id);
      if (existingIndex !== -1) {
        updatedCart[existingIndex] = { 
          ...updatedCart[existingIndex], 
          quantity: updatedCart[existingIndex].quantity + (newItem.quantity || 1) 
        };
      } else {
        updatedCart.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
    });
    
    return updatedCart;
  });
};

  const updateQuantity = (id: string, delta: number) => {
    setItems(curr => curr.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

    const removeItem = (id: string) => {
    setItems(curr => curr.filter(i => i.id !== id));
    };

  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, backendItems, addItem, addItems, removeItem, updateQuantity, clearCart, totalPrice, totalItems, isLoading 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};