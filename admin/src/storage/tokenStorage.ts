// src/storage/tokenStorage.ts

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export const TokenStorage = {
    // Zachowujemy 'async', żeby TypeScript w api.ts nie krzyczał,
    // mimo że localStorage jest synchroniczne.
    
    saveTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
        try {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } catch (error) {
            console.error('Błąd zapisu tokenów', error);
        }
    },

    getAccessToken: async (): Promise<string | null> => {
        try {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        } catch (error) {
            return null;
        }
    },

    getRefreshToken: async (): Promise<string | null> => {
        try {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            return null;
        }
    },

    clearTokens: async (): Promise<void> => {
        try {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Błąd czyszczenia tokenów', error);
        }
    }
};