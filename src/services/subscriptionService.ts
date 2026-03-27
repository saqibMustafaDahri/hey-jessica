import api from '../lib/axios';
import { SubscriptionPlan } from '../data/mockData';

export const getPlans = async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
};

export const savePlan = async (plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    const response = await api.post('/subscriptions/plans', plan);
    return response.data;
};

export const deletePlan = async (id: string): Promise<void> => {
    await api.delete(`/subscriptions/plans/${id}`);
};
