import axios from 'axios';
import { mockPlans, mockTutorialVideos, mockDeepfakeVideos } from '../data/mockData';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

api.interceptors.request.use(
    (config) => {

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const getMockPlans = () => {
    const saved = localStorage.getItem('mock_subscription_plans');
    if (saved) return JSON.parse(saved);
    return mockPlans;
};

const saveMockPlans = (plans: any[]) => {
    localStorage.setItem('mock_subscription_plans', JSON.stringify(plans));
};

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const isNetworkError = !error.response;
        const isDev = import.meta.env.DEV;

        if (USE_MOCKS || (isNetworkError && isDev)) {
            const { url = '', method = '', data: configData } = error.config;
            let currentPlans = getMockPlans();

            console.warn(`[MOCK API] ${method.toUpperCase()} ${url} - Falling back to persisted mock data.`);

            if (url.includes('/subscriptions/plans')) {
                if (method === 'get') {
                    return { data: currentPlans, status: 200, statusText: 'OK', headers: {}, config: error.config };
                }

                if (method === 'post') {
                    let payload: any = {};
                    try {
                        payload = typeof configData === 'string' ? JSON.parse(configData) : (configData || {});
                    } catch (e) {
                        payload = configData || {};
                    }

                    if (payload.id) {
                        currentPlans = currentPlans.map((p: any) => p.id === payload.id ? { ...p, ...payload } : p);
                    } else {
                        payload.id = Date.now().toString();
                        currentPlans.push(payload);
                    }
                    saveMockPlans(currentPlans);
                    return { data: payload, status: 201, statusText: 'Created', headers: {}, config: error.config };
                }

                if (method === 'delete') {
                    const id = url.split('/').pop();
                    currentPlans = currentPlans.filter((p: any) => p.id !== id);
                    saveMockPlans(currentPlans);
                    return { data: {}, status: 200, statusText: 'OK', headers: {}, config: error.config };
                }
            }
        }

        const message = error.response?.data?.message || error.message || 'Something went wrong';
        console.group('API Error');
        console.error('Message:', message);
        console.groupEnd();

        return Promise.reject(error);
    }
);

export default api;
