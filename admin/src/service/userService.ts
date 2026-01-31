import { api as axiosInstance } from "../api/api";
import type { UserProfilePatchRequest, UserProfileResponse } from "../types/user";

export const UserService = {
    getDetails: async (): Promise<UserProfileResponse> => {
        try {
            const response = await axiosInstance.get<UserProfileResponse>('/user/me');
            return response.data;
        } catch (error: any) {
            console.error('UserService Error:', error);
            throw error;
        }
    },
     
        getAll: async (): Promise<UserProfileResponse[]> => {
            const response = await axiosInstance.get<UserProfileResponse[]>('/user/'); 
            return response.data;
        },
    
        getOne: async (id: string): Promise<UserProfileResponse | null> => {
            const response = await axiosInstance.get<UserProfileResponse>(`/user/${id}`);
            return response.data;
        },
        
        update: async (id: string, data: UserProfilePatchRequest) => {
            console.log(data);
            const response = await axiosInstance.patch(`/user/${id}`, data);
            return response.data;
        },
        
        create: async (data: any) => {
            const isSupplier = data.roles && data.roles.includes('SUPPLIER');
            if (isSupplier) {
                const { roles, ...supplierData } = data;
                const response = await axiosInstance.post(`/user/register/supplier`, supplierData);
                return response.data;
            } else {
                const response = await axiosInstance.post(`/user/register`, data);
                return response.data;
            }
        },
    
        delete: async(id: string): Promise<void> => {
            const response = await axiosInstance.delete(`/user/${id}`);
            return response.data;
        }
};