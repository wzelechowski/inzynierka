import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export const TokenStorage = {
    saveTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
        try {
            await AsyncStorage.multiSet([
                [ACCESS_TOKEN_KEY, accessToken],
                [REFRESH_TOKEN_KEY, refreshToken]
            ]);
        } catch (error) {
            console.error('Błąd zapisu tokenów', error);
        }
    },

    getAccessToken: async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        } catch (error) {
            return null;
        }
    },

    getRefreshToken: async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            return null;
        }
    },

    clearTokens: async (): Promise<void> => {
        try {
            await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
        } catch (error) {
            console.error('Błąd czyszczenia tokenów', error);
        }
    }
};