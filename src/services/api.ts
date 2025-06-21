import axios from 'axios';
import { sessionManager } from './session';

const API_URL = 'http://localhost:4444/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(async (config) => {
    const session = await sessionManager.getSession();
    if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const session = await sessionManager.getSession();
                if (!session?.refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await api.post('/auth/refresh-token', {
                    refreshToken: session.refreshToken,
                });

                const { accessToken, refreshToken, userId } = response.data.data;
                const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

                await sessionManager.setSession({
                    accessToken,
                    refreshToken,
                    userId,
                    expiresAt,
                });

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (error) {
                await sessionManager.clearSession();
                window.location.href = '/auth/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// Auth API methods
export const authApi = {
    // Signup
    signup: async (data: { email?: string; password?: string; authMethod: 'password' | 'token' }) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    // Login
    login: async (data: { email?: string; password?: string; token?: string; authMethod: 'password' | 'token' }) => {
        const response = await api.post('/auth/login', data);
        if (response.data.success) {
            const { accessToken, refreshToken, userId } = response.data.data;
            const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

            await sessionManager.setSession({
                accessToken,
                refreshToken,
                userId,
                expiresAt,
            });
        }
        return response.data;
    },

    // Forgot Password
    forgotPassword: async (email: string) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset Password
    resetPassword: async (data: { token: string; newPassword: string }) => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    },

    // Forgot Token
    forgotToken: async (email: string) => {
        const response = await api.post('/auth/forgot-token', { email });
        return response.data;
    },

    // Verify Token Recovery
    verifyTokenRecovery: async (data: { token: string; email: string }) => {
        const response = await api.post('/auth/verify-token-recovery', data);
        return response.data;
    },

    // Logout
    logout: async () => {
        await sessionManager.clearSession();
    },
};

export default api; 