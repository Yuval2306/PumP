import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('pump_user') || 'null'),
  token: localStorage.getItem('pump_token') || null,
  loading: false,
  error: null,

  setUser: (user) => {
    localStorage.setItem('pump_user', JSON.stringify(user));
    set({ user });
  },

  setToken: (token) => {
    localStorage.setItem('pump_token', token);
    set({ token });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      set({ loading: false });
      return { success: true, userId: data.userId };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Login failed' });
      return { success: false };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      set({ loading: false });
      return { success: true, userId: data.userId };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Registration failed' });
      return { success: false };
    }
  },

  verifyOTP: async (userId, otp, isLogin = false) => {
    set({ loading: true, error: null });
    try {
      const endpoint = isLogin ? '/auth/verify-login-otp' : '/auth/verify-otp';
      const { data } = await api.post(endpoint, { userId, otp });
      localStorage.setItem('pump_token', data.token);
      localStorage.setItem('pump_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Invalid OTP' });
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem('pump_token');
    localStorage.removeItem('pump_user');
    set({ user: null, token: null });
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('pump_user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch (err) {
      // token expired
    }
  }
}));

export default useAuthStore;
