import axios from 'axios';
import { Platform } from 'react-native';
import { TokenStorage } from '../storage/tokenStorage';
import { AuthResponse } from '../types/auth';

const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' 
    : 'http://localhost:8080';

export const API_URL = `${BASE_URL}/api/v1`;

export const api = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await TokenStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                const refreshToken = await TokenStorage.getRefreshToken();
                if (!refreshToken) throw new Error("Brak refresh tokena");
                const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const { access_token, refresh_token } = response.data;

                await TokenStorage.saveTokens(access_token, refresh_token);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.log("Sesja wygasła, wylogowywanie...");
                await TokenStorage.clearTokens();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);