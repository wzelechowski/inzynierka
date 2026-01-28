// src/authProvider.ts
import type { AuthProvider } from 'react-admin';
import { jwtDecode } from 'jwt-decode';

const GATEWAY_URL = 'http://localhost:8080/api/v1';

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        const request = new Request(`${GATEWAY_URL}/user/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email: username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        const response = await fetch(request);
        if (response.status < 200 || response.status >= 300) {
            throw new Error('Błąd logowania');
        }

        const data = await response.json();
        
        // POPRAWKA 1: Keycloak zwraca 'access_token', a nie 'accessToken'
        const token = data.access_token; 
        const refreshToken = data.refresh_token;

        if (!token) {
            throw new Error('Nie otrzymano tokena od serwera (sprawdź czy backend zwraca access_token)');
        }

        // Dekodujemy
        const decoded: any = jwtDecode(token);
        
        // POPRAWKA 2: Szukamy roli 'ROLE_ADMIN' w odpowiednim miejscu dla Twojego Keycloaka
        // W Twoim JSON rola jest w: resource_access -> pizzeria-app -> roles
        
        const resourceAccess = decoded.resource_access?.['pizzeria-app']?.roles || [];
        const realmAccess = decoded.realm_access?.roles || [];
        
        // Łączymy wszystkie role w jedną tablicę
        const allRoles = [...resourceAccess, ...realmAccess];

        console.log('Znalezione role użytkownika:', allRoles);

        // Sprawdzamy czy ma uprawnienia (ROLE_ADMIN lub ADMIN)
        if (!allRoles.includes('ROLE_ADMIN') && !allRoles.includes('ADMIN')) {
            throw new Error('Zalogowano, ale brak roli ROLE_ADMIN w tokenie!');
        }

        localStorage.setItem('access_token', token);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        
        return Promise.resolve();
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.resolve();
    },

    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('access_token');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    checkAuth: () => {
        // Sprawdzamy czy token w ogóle istnieje
        return localStorage.getItem('access_token') ? Promise.resolve() : Promise.reject();
    },

    getPermissions: () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return Promise.reject();
        const decoded: any = jwtDecode(accessToken);
        return Promise.resolve(decoded);
    },
};