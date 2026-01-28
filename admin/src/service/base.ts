// src/services/base.ts
import { api } from '../api/api';

// Interfejs, który każdy serwis musi spełniać
export interface ResourceService {
    getAll: () => Promise<any[]>;
    getOne: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<void>;
}

export const createService = (endpoint: string): ResourceService => ({
    
    getAll: async () => {
        const response = await api.get(endpoint);
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post(endpoint, data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const { id: _, ...cleanData } = data;
        const response = await api.put(`${endpoint}/${id}`, cleanData);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`${endpoint}/${id}`);
    }
});