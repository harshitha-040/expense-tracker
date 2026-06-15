import api from '../api/axios';
import type { Transaction, TransactionRequest } from '../types';

const getUserEmail = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.email;
};

export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    const email = getUserEmail();
    const response = await api.get(`/transactions/all?email=${email}`);
    return response.data;
  },

  getTotals: async () => {
    const email = getUserEmail();
    const response = await api.get(`/transactions/totals?email=${email}`);
    return response.data;
  },

  add: async (transaction: TransactionRequest) => {
    const email = getUserEmail();
    const response = await api.post(`/transactions/add?email=${email}`, transaction);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/transactions/delete/${id}`);
    return response.data;
  },

  update: async (id: number, transaction: TransactionRequest) => {
    const response = await api.put(`/transactions/update/${id}`, transaction);
    return response.data;
  },
};
