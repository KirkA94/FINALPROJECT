'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired } from '@/lib/tokenUtils';

interface User {
  username: string;
  profileImage?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Automatically refresh the token or log out the user
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && storedUser && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    } else if (refreshToken) {
      // Attempt to refresh the token if it exists
      refreshAccessToken(refreshToken);
    } else {
      logout();
    }
  }, []);

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const { accessToken, user } = await response.json();
        login(accessToken, user, refreshToken);
      } else {
        console.error('Failed to refresh access token.');
        logout();
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
    }
  };

  const login = (token: string, user: User, refreshToken: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};