import api from '../api/axios';
import type { Category } from '../types';

const getUserEmail = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.email;
};

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const email = getUserEmail();
    const response = await api.get(`/categories?email=${email}`);
    return response.data;
  },

  add: async (category: Partial<Category>) => {
    const email = getUserEmail();
    const response = await api.post(`/categories?email=${email}`, category);
    return response.data;
  },
};
