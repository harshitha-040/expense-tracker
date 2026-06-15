import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import api from '../api/axios';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<string>;
  register: (data: RegisterRequest) => Promise<string>;
  upgrade: () => Promise<string>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial check is handled by useState initializer
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;

      if (data.message === 'Login Successful' && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data.message;
    } catch (error: unknown) {
      const err = error as any;
      return err.response?.data?.message || 'Login failed';
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await api.post('/auth/register', data);
      const responseData = response.data;
      
      if (responseData.message === 'User Registered Successfully' && responseData.user) {
        return responseData.message;
      }
      return responseData.message;
    } catch (error: unknown) {
      const err = error as any;
      return err.response?.data?.message || 'Registration failed';
    }
  };

  const upgrade = async () => {
    if (!user) return 'Not logged in';
    try {
      const response = await api.post(`/auth/upgrade?email=${user.email}`);
      const data = response.data;
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data.message;
    } catch (error: unknown) {
      const err = error as any;
      return err.response?.data?.message || 'Upgrade failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, upgrade, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
