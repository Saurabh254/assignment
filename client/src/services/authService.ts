import api from '../api_client';

export interface LoginCredentials {
    rollNumber: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    rollNumber: string;
    class: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    rollNumber: string;
    class: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    // Store token in localStorage
    localStorage.setItem('token', response.data.token);
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    // Store token in localStorage
    localStorage.setItem('token', response.data.token);
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
};

export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
};

export const getUserFromStorage = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (error) {
        return null;
    }
};