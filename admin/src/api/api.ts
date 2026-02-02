import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
export const API_URL = `${BASE_URL}/api/v1`;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        
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

        if (error.message === "Network Error") {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                if (!refreshToken) {
                    throw new Error("Brak refresh tokena w localStorage");
                }

                const response = await axios.post(`${API_URL}/user/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const { access_token, refresh_token } = response.data;

                localStorage.setItem('access_token', access_token);
                if (refresh_token) {
                    localStorage.setItem('refresh_token', refresh_token);
                }

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error("Sesja wygasła lub błąd odświeżania tokena", refreshError);
                
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token'); 
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);