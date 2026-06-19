// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    
    // Separate token from user fields cleanly
    const { token, ...userData } = data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // no token inside user
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const { data } = await axiosInstance.post('/auth/register', { name, email, password });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Expose token getter so guards don't read localStorage directly
  const getToken = () => localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);