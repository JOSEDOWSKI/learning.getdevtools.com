'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    dni: string;
    full_name: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      api.setToken(token);
      const response = await api.getProfile();
      if (response.data) {
        setUser(response.data);
      } else {
        api.clearToken();
      }
    } catch (error) {
      api.clearToken();
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    const response = await api.login(email, password);
    if (response.data) {
      setUser(response.data.user);
      return true;
    }
    return false;
  }

  async function register(userData: {
    dni: string;
    full_name: string;
    email: string;
    password: string;
  }): Promise<boolean> {
    try {
      const response = await api.register(userData);
      if (response.data && response.data.user) {
        // El registro devuelve access_token y user
        if (response.data.access_token) {
          api.setToken(response.data.access_token);
          localStorage.setItem('token', response.data.access_token);
        }
        setUser(response.data.user);
        // Forzar actualización del estado
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
      }
      if (response.error) {
        console.error('Registration error:', response.error);
      }
      return false;
    } catch (error) {
      console.error('Registration exception:', error);
      return false;
    }
  }

  function logout() {
    api.clearToken();
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

