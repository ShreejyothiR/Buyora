import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('buyora_token');
    const savedUser = localStorage.getItem('buyora_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify with backend
        authApi.getMe()
          .then((res) => {
            setUser(res.data);
            localStorage.setItem('buyora_user', JSON.stringify(res.data));
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('buyora_token', token);
    localStorage.setItem('buyora_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('buyora_token', token);
    localStorage.setItem('buyora_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('buyora_token');
    localStorage.removeItem('buyora_user');
    setUser(null);
  };

  const updatePreferences = async (newWeights) => {
    const res = await authApi.updatePreferences(newWeights);
    if (user) {
      const updated = { ...user, preferences: res.data.preferences };
      setUser(updated);
      localStorage.setItem('buyora_user', JSON.stringify(updated));
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
