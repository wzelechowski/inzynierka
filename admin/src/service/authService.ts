import type { AuthRequest, AuthResponse, RegisterRequest } from "../types/auth";
import { TokenStorage } from "../storage/tokenStorage";
import { api } from "../api/api";

export const AuthService = {
    login: async (credentials: AuthRequest): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/user/auth/login', credentials);
            
            const data = response.data; 
            await TokenStorage.saveTokens(data.access_token, data.refresh_token);

            return data;
        } catch (error: any) {
            const message = error.response?.data?.message || "Błąd logowania";
            console.error('AuthService login error', message);
            throw new Error(message);
        }
    },

    refreshAccessToken: async (): Promise<AuthResponse> => {
        try {
            const refreshToken = await TokenStorage.getRefreshToken();
            if (!refreshToken) throw new Error("No refresh token");

            const response = await api.post<AuthResponse>('user/auth/refresh', { 
                refreshToken 
            });
            
            const data = response.data;
            await TokenStorage.saveTokens(data.access_token, data.refresh_token);
            return data;
        } catch (error) {
            await TokenStorage.clearTokens();
            throw error;
        }
    },

    register: async(credentials: RegisterRequest): Promise<void> => {
        try {
            await api.post('/user/register', credentials);
        } catch (error: any) {
            const message = error.response?.data?.message || "Błąd przy rejestracji";
            throw new Error(message);
        }
    },

    logout: async (): Promise<void> => {
        try {
            const refreshToken = await TokenStorage.getRefreshToken();
            if (refreshToken) {
                await api.post('/user/auth/logout', { refreshToken });
            }
        } catch (e) {
            console.warn("Backend logout failed", e);
        } finally {
            await TokenStorage.clearTokens();
        }
    }
}