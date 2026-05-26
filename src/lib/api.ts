import axios from 'axios';

const api = axios.create({
    baseURL: 'https://mrs.sarvosmi.io/api',
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const inventoryApi = {
    // Products
    getAllProducts: async () => {
        const response = await api.get('/inventory/products');
        return response.data;
    },
    saveProduct: async (product: any) => {
        const response = await api.post('/inventory/products', product);
        return response.data;
    },
    // Warehouses
    getAllWarehouses: async () => {
        const response = await api.get('/inventory/warehouses');
        return response.data;
    },
    saveWarehouse: async (warehouse: any) => {
        const response = await api.post('/inventory/warehouses', warehouse);
        return response.data;
    },
    // Suppliers
    getAllSuppliers: async () => {
        const response = await api.get('/inventory/suppliers');
        return response.data;
    },
    saveSupplier: async (supplier: any) => {
        const response = await api.post('/inventory/suppliers', supplier);
        return response.data;
    },
    // Sales
    getAllSales: async () => {
        const response = await api.get('/inventory/sales');
        return response.data;
    },
    getSaleById: async (id: number) => {
        const response = await api.get(`/inventory/sales/${id}`);
        return response.data;
    },
    printSale: async (id: number) => {
        const response = await api.get(`/inventory/sales/${id}/print`);
        return response.data;
    },
    saveSale: async (sale: any) => {
        const response = await api.post('/inventory/sales', sale);
        return response.data;
    },
    // Purchases
    getAllPurchases: async () => {
        const response = await api.get('/inventory/purchases');
        return response.data;
    },
    savePurchase: async (purchase: any) => {
        const response = await api.post('/inventory/purchases', purchase);
        return response.data;
    },
    // Categories
    getAllCategories: async () => {
        const response = await api.get('/inventory/categories');
        return response.data;
    }
};

export const salesApi = {
    // Customers
    getAllCustomers: async () => {
        const response = await api.get('/sales/customers');
        return response.data;
    },
    saveCustomer: async (customer: any) => {
        const response = await api.post('/sales/customers', customer);
        return response.data;
    },
    deleteCustomer: async (id: number) => {
        const response = await api.delete(`/sales/customers/${id}`);
        return response.data;
    },
    // Estimates
    getAllEstimates: async () => {
        const response = await api.get('/sales/estimates');
        return response.data;
    },
    saveEstimate: async (estimate: any) => {
        const response = await api.post('/sales/estimates', estimate);
        return response.data;
    },
    deleteEstimate: async (id: number) => {
        const response = await api.delete(`/sales/estimates/${id}`);
        return response.data;
    },
    getEstimateById: async (id: number) => {
        const response = await api.get(`/sales/estimates/${id}`);
        return response.data;
    },
    printEstimate: async (id: number) => {
        const response = await api.get(`/sales/estimates/${id}/print`);
        return response.data;
    }
};

export const accountingApi = {
    getAllLedgers: async () => {
        const response = await api.get('/accounting/ledgers');
        return response.data;
    },
    getPaymentAccounts: async () => {
        const response = await api.get('/accounting/ledgers/payment-accounts');
        return response.data;
    },
    saveLedger: async (ledger: any) => {
        const response = await api.post('/accounting/ledgers', ledger);
        return response.data;
    }
};

export const accountsApi = {
    // Financial Accounts (Bank/Cash)
    getAllAccounts: async () => {
        const response = await api.get('/accounting/accounts');
        return response.data;
    },
    saveAccount: async (account: any) => {
        const response = await api.post('/accounting/accounts', account);
        return response.data;
    },
    saveTransaction: async (txn: any) => {
        const response = await api.post('/accounting/vouchers', txn);
        return response.data;
    }
};

export const ledgersApi = {
    // Account Heads (Ledgers like Sales, Rent, etc.)
    getAllLedgers: async () => {
        const response = await api.get('/accounting/ledgers');
        return response.data;
    },
    saveLedger: async (ledger: any) => {
        const response = await api.post('/accounting/ledgers', ledger);
        return response.data;
    }
};

export const userApi = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getUserById: async (id: number) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    createUser: async (user: any) => {
        const response = await api.post('/users/register', user);
        return response.data;
    },
    updateUser: async (id: number, user: any) => {
        const response = await api.put(`/users/${id}`, user);
        return response.data;
    }
};

export const attendanceApi = {
    getCalendar: async (userId: string, month: string) => {
        const response = await api.get(`/attendance/calendar?userId=${userId}&month=${month}`);
        return response.data;
    },
    getSummary: async (userId: string, month: string) => {
        const response = await api.get(`/attendance/summary?userId=${userId}&month=${month}`);
        return response.data;
    }
};

export const salaryApi = {
    getConfigs: async () => {
        const response = await api.get('/salary/configs');
        return response.data;
    },
    getConfigByUser: async (userId: number) => {
        const response = await api.get(`/salary/configs/user/${userId}`);
        return response.data;
    },
    saveConfig: async (config: any) => {
        const response = await api.post('/salary/configs', config);
        return response.data;
    },
    generatePayroll: async (month: string) => {
        const response = await api.post(`/salary/generate?month=${month}`);
        return response.data;
    },
    getHistory: async (userId: number) => {
        const response = await api.get(`/salary/history/${userId}`);
        return response.data;
    },
    updateStatus: async (id: number, status: string) => {
        const response = await api.put(`/salary/history/${id}/status?status=${status}`);
        return response.data;
    }
};

export default api;
