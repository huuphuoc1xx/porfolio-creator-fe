import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import * as api from '../services/api';

const AUTH_KEY = 'portfolio-auth';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface StoredAuth {
  user: AuthUser;
  token: string;
}

function loadStoredAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredAuth;
    if (data?.user?.id && data?.token) {
      api.setAuthToken(data.token);
      return data.user;
    }
    return null;
  } catch {
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = loadStoredAuth();
    setUser(u);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login({ email, password });
    api.setAuthToken(res.access_token);
    setUser(res.user);
    try {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ user: res.user, token: res.access_token }),
      );
    } catch {
      /* noop */
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await api.register({ email, password });
    api.setAuthToken(res.access_token);
    setUser(res.user);
    try {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ user: res.user, token: res.access_token }),
      );
    } catch {
      /* noop */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    api.setAuthToken(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
