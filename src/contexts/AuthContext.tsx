// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, FC } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface User { /* ... */ }
export interface LoginResponse { user: User; token: string; }

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  user: null, token: null, loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('auth_token');
        if (t) {
          setToken(t);
          api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
          const res = await api.get<{ user: User }>('/app/user');
          setUser(res.data.user);
        }
      } catch (e) {
        console.error('Error validando token:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<LoginResponse>('/app/login', { email, password });
    const { user: u, token: t } = res.data;
    await AsyncStorage.setItem('auth_token', t);
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setUser(u);
    setToken(t);
  };

  const logout = async () => {
    try {
      await api.post('/app/logout');
    } catch {
      // ignorar fallo
    }
    await AsyncStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
