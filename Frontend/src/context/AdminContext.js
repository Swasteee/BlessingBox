import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdmin(true);
      // Optionally verify token with backend
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.adminLogin(username, password);
      localStorage.setItem('adminToken', response.token);
      setAdmin(response.admin);
      setIsAdmin(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setAdmin(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, admin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

