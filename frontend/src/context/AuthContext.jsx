import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('payshield_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('payshield_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('payshield_token', token);
    } else {
      localStorage.removeItem('payshield_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('payshield_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('payshield_user');
    }
  }, [user]);

  const loginUser = async (email, password, mfaCode) => {
    setLoading(true);
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, mfaCode })
    });

    setLoading(false);
    if (res.ok) {
      if (res.data.token) {
        setToken(res.data.token);
        setUser(res.data.user);
      }
    }
    return res;
  };

  const registerUser = async (name, email, password) => {
    setLoading(true);
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    setLoading(false);
    if (res.ok && res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const logoutUser = async () => {
    if (token) {
      await apiRequest('/auth/logout', { method: 'POST' });
    }
    setToken(null);
    setUser(null);
  };

  // Demo helper to quickly switch admin role for testing RBAC live!
  const setDemoRole = async (targetRole) => {
    const roleEmails = {
      super_admin: 'super.admin@payshield.com',
      security_admin: 'security.admin@payshield.com',
      support_admin: 'support.admin@payshield.com',
      auditor: 'auditor@payshield.com',
      customer: 'alex.morgan@acme-corp.com'
    };

    const targetEmail = roleEmails[targetRole] || roleEmails.super_admin;
    const passwords = {
      'super.admin@payshield.com': 'SuperShield123!@#',
      'security.admin@payshield.com': 'SecAdmin123!@#',
      'support.admin@payshield.com': 'SuppAdmin123!@#',
      'auditor@payshield.com': 'Auditor123!@#',
      'alex.morgan@acme-corp.com': 'Customer123!@#'
    };

    return await loginUser(targetEmail, passwords[targetEmail], '123456');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      loginUser,
      registerUser,
      logoutUser,
      setDemoRole,
      isAuthenticated: !!token && !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
