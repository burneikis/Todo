import React, { useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';
import { authService } from '../services/authService';
import { setGlobalLogoutHandler } from '../services/api';
import { AuthContext } from './AuthContextDefinition';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    setToken(response.token);
    authService.storeAuth(response.user, response.token);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authService.register(email, password, name);
    setUser(response.user);
    setToken(response.token);
    authService.storeAuth(response.user, response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authService.logout();
  };

  // Register the logout handler with the API service
  useEffect(() => {
    setGlobalLogoutHandler(logout);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};