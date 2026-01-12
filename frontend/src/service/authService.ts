import { AuthRequest, AuthResponse, RegisterRequest } from "../types/auth";
import { TokenStorage } from "../storage/tokenStorage";
import { Platform } from "react-native";
import { RefreshTokenRequest } from "expo-auth-session";

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

const API_URL = `${BASE_URL}/api/v1/user`;

export const AuthService = {
    login: async (credentials: AuthRequest): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                let errorMessage = "Błąd logowania";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {}
                throw new Error(errorMessage);
            }

            const data: AuthResponse = await response.json();
            await TokenStorage.saveTokens(data.access_token, data.refresh_token);
            
        } catch (error) {
            console.error('AuthService login error', error);
            throw error;
        }
    },

    refreshAccessToken: async (request: RefreshTokenRequest): Promise<AuthResponse> => {
        try {
            const refreshToken = await TokenStorage.getRefreshToken();
            if (!refreshToken) throw new Error("No refresh token available");

            const response = await fetch(`${API_URL}/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                await TokenStorage.clearTokens();
                throw new Error("Session expired");
            }

            const data: AuthResponse = await response.json();
            await TokenStorage.saveTokens(data.access_token, data.refresh_token);
            
            return data;
        } catch (error) {
            console.error('AuthService refresh error', error);
            throw error;
        }
    },

    register: async(credentials: RegisterRequest): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                let errorMessage = "Błąd przy rejestracji";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {}
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('AuthService register error', error);
            throw error;
        }
    },

    logout: async () => {
        await TokenStorage.clearTokens();
    }
}