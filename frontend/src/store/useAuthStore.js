import { create } from 'zustand';
import { loginAPI, registerAPI, getWristbandAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  // --- States ---
  user: null,
  wristband: null,
  loading: true,
  isAuthenticated: false,

  // --- Actions ---
  initializeAuth: async () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        set({ user: parsedUser, isAuthenticated: true });
        await get().fetchWristband(parsedUser.id);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        get().logout();
      }
    }
    set({ loading: false });
  },

  fetchWristband: async (userId) => {
    try {
      const response = await getWristbandAPI(userId);
      if (response.success && response.data) {
        const wb = Array.isArray(response.data) ? response.data[0] : response.data;
        set({ wristband: wb || null });
      }
    } catch (error) {
      console.error("Failed to fetch wristband info:", error);
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await loginAPI(email, password);
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isAuthenticated: true });
        await get().fetchWristband(userData.id);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: errorMsg };
    } finally {
      set({ loading: false });
    }
  },

  register: async (firstName, lastName, email, password) => {
    set({ loading: true });
    try {
      const response = await registerAPI(firstName, lastName, email, password);
      if (response.success) {
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: errorMsg };
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, wristband: null, isAuthenticated: false });
  },

  refreshWristband: () => {
    const user = get().user;
    if (user) {
      get().fetchWristband(user.id);
    }
  },

  updateWristbandState: (newWristband) => {
    set({ wristband: newWristband });
  }
}));
