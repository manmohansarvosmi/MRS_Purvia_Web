import axios from 'axios';

const API_BASE_URL = 'https://mrs.sarvosmi.io/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiry (401 only)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        // 401 = token expired / invalid → logout
        // 403 = forbidden (no permission) → do NOT logout, just reject
        if (status === 401) {
            localStorage.removeItem('userToken');
            window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
    }
);

export const attendanceApi = {
    getCalendar: async (userId: string, month: string) => {
        const response = await api.get(`/attendance/calendar?userId=${userId}&month=${month}`);
        return response.data;
    },
    getSummary: async (userId: string, month: string) => {
        const response = await api.get(`/attendance/summary?userId=${userId}&month=${month}`);
        return response.data;
    },
};

export const salaryApi = {
    saveConfig: async (config: any) => {
        const response = await api.post('/salary/config', config);
        return response.data;
    },
    getConfigs: async () => {
        const response = await api.get('/salary/config');
        return response.data;
    },
    getConfigByUser: async (userId: number) => {
        const response = await api.get(`/salary/config/user/${userId}`);
        return response.data;
    },
    generatePayroll: async (month: string) => {
        const response = await api.post(`/salary/generate?month=${month}`);
        return response.data;
    },
    getHistory: async (userId: string) => {
        const response = await api.get(`/salary/history/${userId}`);
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await api.put(`/salary/payroll/${id}/status?status=${status}`);
        return response.data;
    },
};

export const userApi = {
    createUser: async (user: any) => {
        const response = await api.post('/users/createUser', user);
        return response.data;
    },
    getAllUsers: async () => {
        const response = await api.get('/users/getAllUsers');
        return response.data;
    },
    getUserById: async (id: number) => {
        const response = await api.get(`/users/getUsersById/${id}`);
        return response.data;
    },
    updateUser: async (id: number, user: any) => {
        const response = await api.post(`/users/updateUserById/${id}`, user);
        return response.data;
    }
};

export default api;
