import axios from 'axios';

// Set backend URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4444';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Session manager for frontend
export const sessionManager = {
    setSession: async (session: { accessToken: string; refreshToken: string; userId: string; expiresAt: number }) => {
        sessionStorage.setItem('auth_session', JSON.stringify(session));
    },
    
    getSession: async () => {
        const session = sessionStorage.getItem('auth_session');
        return session ? JSON.parse(session) : null;
    },
    
    clearSession: async () => {
        sessionStorage.removeItem('auth_session');
    }
};

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const session = await sessionManager.getSession();
                if (!session?.refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await api.post('/api/auth/refresh-token', {
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
        const response = await api.post('/api/auth/signup', data);
        return response.data;
    },

    // Login
    login: async (data: { email?: string; password?: string; token?: string; authMethod: 'password' | 'token' }) => {
        const response = await api.post('/api/auth/login', data);
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
        const response = await api.post('/api/auth/forgot-password', { email });
        return response.data;
    },

    // Reset Password
    resetPassword: async (data: { token: string; newPassword: string }) => {
        const response = await api.post('/api/auth/reset-password', data);
        return response.data;
    },

    // Forgot Token
    forgotToken: async (email: string) => {
        const response = await api.post('/api/auth/forgot-token', { email });
        return response.data;
    },

    // Verify Token Recovery
    verifyTokenRecovery: async (data: { token: string; email: string }) => {
        const response = await api.post('/api/auth/verify-token-recovery', data);
        return response.data;
    },

    // Logout
    logout: async () => {
        await sessionManager.clearSession();
    },
};

export default api; 