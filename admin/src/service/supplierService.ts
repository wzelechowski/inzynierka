import { api as axiosInstance } from '../api/api';
import type { SupplierResponse } from '../types/supplier';

export const SupplierService = {
    
    getAll: async (): Promise<SupplierResponse[]> => {
        const response = await axiosInstance.get<SupplierResponse[]>('/delivery/suppliers'); 
        return response.data;
    },

    getOne: async (id: string): Promise<SupplierResponse | null> => {
        const response = await axiosInstance.get<SupplierResponse>(`/delivery/suppliers/${id}`);
        return response.data;
    },
    
    update: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/delivery/suppliers/${id}`, data);
        return response.data;
    },
    
    create: async (data: any) => {
        const response = await axiosInstance.post(`/delivery/suppliers`, data);
        return response.data;
    },

    delete: async(id: string): Promise<void> => {
        const response = await axiosInstance.delete(`/delivery/suppliers/${id}`);
        return response.data;
    }
};
