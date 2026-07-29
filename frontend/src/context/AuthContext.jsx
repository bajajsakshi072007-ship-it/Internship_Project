import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse saved user session from localStorage:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync token state on initial mount / rehydration
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(credentials);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.register(userData);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isArtisan = user && (user.role === 'artisan' || user.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, token, isArtisan, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

