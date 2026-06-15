export interface User {
  id: number;
  name: string;
  email: string;
  role: 'FREE' | 'PREMIUM' | 'ADMIN';
  accountStatus: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string;
  colorHex?: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: Category;
  transactionDate: string;
  notes?: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  plan?: string;
}

export interface TransactionRequest {
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  categoryId: number;
  transactionDate: string;
  notes?: string;
}
