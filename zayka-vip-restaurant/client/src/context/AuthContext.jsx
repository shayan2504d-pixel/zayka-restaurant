import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zayka_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'reset'
  const [resetTokenParam, setResetTokenParam] = useState('');

  // Initial load check
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('zayka_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (identifier, password, rememberMe = false) => {
    const res = await api.post('/auth/login', { identifier, password, rememberMe });
    if (res.success && res.token) {
      localStorage.setItem('zayka_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      return res;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success && res.token) {
      localStorage.setItem('zayka_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      return res;
    }
    throw new Error(res.message || 'Registration failed.');
  };

  const loginWithGoogle = async (googlePayload) => {
    const res = await api.post('/auth/google', googlePayload);
    if (res.success && res.token) {
      localStorage.setItem('zayka_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      return res;
    }
    throw new Error(res.message || 'Google login failed.');
  };

  const logout = () => {
    localStorage.removeItem('zayka_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.success && res.user) {
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Failed to update profile.');
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res;
  };

  const requestForgotPassword = async (identifier) => {
    return await api.post('/auth/forgot-password', { identifier });
  };

  const submitResetPassword = async (token, newPassword, confirmPassword) => {
    return await api.post('/auth/reset-password', { token, newPassword, confirmPassword });
  };

  const openAuth = (mode = 'login', resetToken = '') => {
    setAuthModalMode(mode);
    setResetTokenParam(resetToken);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        authModalOpen,
        authModalMode,
        resetTokenParam,
        setAuthModalMode,
        setResetTokenParam,
        openAuth,
        closeAuth,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        changePassword,
        requestForgotPassword,
        submitResetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
