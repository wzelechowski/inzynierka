import { api } from "../api/api";
import { UserProfileResponse } from "../types/user";

export const UserService = {
    getDetails: async (): Promise<UserProfileResponse> => {
        try {
            const response = await api.get<UserProfileResponse>('/user/me');
            return response.data;
        } catch (error: any) {
            console.error('UserService Error:', error);
            throw error;
        }
    }
};